import models from "../models/index.js";
import PostgresStorage from "../db-adapters/postgres.js";
import {fillTemplate} from "../helpers/fillTemplate.js";

const {
    Contact,
    Message,
    Organization,
    Segment,
    Language,
    EmailContent,
    EmailTemplate
} = models;

const surveyStorage = PostgresStorage();


const getSurvey = async (surveyId) => {
    const survey = await surveyStorage.getSurvey(surveyId);
    if (!survey) throw new Error("Survey not found");
    return survey;
};


export const sendSurveyToContact = async (contactId, surveyId, emailTemplateId) => {

    if (!emailTemplateId) throw new Error("emailTemplateId est requis");

    const contact = await Contact.findByPk(contactId, {
        include: [
            { model: Organization, as: "organization" },
            { model: Language, as: "language" }
        ]
    });

    if (!contact) throw new Error("Contact not found");
    if (!contact.language) throw new Error("Le contact n'a pas de langue assignée");

    const survey = await getSurvey(surveyId);

    const template = await EmailTemplate.findByPk(emailTemplateId, {
        include: [{ model: EmailContent, as: "contents" }]
    });

    if (!template) throw new Error("EmailTemplate non trouvé");

    let content = template.contents.find(c => c.languageId === contact.language_id)
        || template.contents[0];

    if (!content) throw new Error("Aucun EmailContent disponible pour ce template");

    const variables = {
        first_name: contact.firstname,
        last_name: contact.lastname,
        organization_name: contact.organization?.name || "",
        survey_name: survey.name,
        survey_description: survey.json?.description || "",
        lang: contact.language?.languageCode,
        survey_link: `https://monark-survey.mytalents-academy.com/preview/${survey.id}`,
        surveyLink: "Take the survey"
    };

    const { subject, html, text } = fillTemplate(content, template, variables);

    const message = await Message.create({
        firstname: contact.firstname,
        type: contact.type,
        to: contact.value,
        subject: subject,
        body_html: html,
        body_text: text
    });

    return { status: "stored", messageId: message.id };
};


export const sendSurveyToSegment = async (segmentId, surveyId, emailTemplateId) => {

    if (!emailTemplateId) {
        throw new Error("emailTemplateId est requis");
    }

    const segment = await Segment.findByPk(segmentId, {
        include: [{
            model: Contact,
            as: "contacts",
            include: [
                { model: Organization, as: "organization" },
                { model: Language, as: "language" }
            ]
        }]
    });

    if (!segment) throw new Error("Segment not found");


    return await Promise.all(
        segment.contacts.map(async (contact) => {
            try {
                const r = await sendSurveyToContact(
                    contact.id,
                    surveyId,
                    emailTemplateId
                );
                return {contactId: contact.id, status: "sent", messageId: r.messageId};
            } catch (err) {
                return {contactId: contact.id, status: "failed", error: err.message};
            }
        })
    );
};


export const sendContactSurvey = async (req, res) => {
    try {
        const { contactId, surveyId, emailTemplateId } = req.params;
        const result = await sendSurveyToContact(contactId, surveyId, emailTemplateId);

        return res.json({
            message: "Message enregistré",
            result
        });

    } catch (err) {
        console.error("sendContactSurvey error:", err);
        return res.status(500).json({
            message: "Erreur serveur",
            error: err.message
        });
    }
};


export const sendSegmentSurvey = async (req, res) => {
    try {
        const { segmentId, surveyId, emailTemplateId } = req.params;

        const results = await sendSurveyToSegment(segmentId, surveyId, emailTemplateId);

        return res.json({
            message: "Messages envoyés",
            results
        });

    } catch (err) {
        console.error("sendSegmentSurvey error:", err);
        return res.status(500).json({
            message: "Erreur serveur",
            error: err.message
        });
    }
};
