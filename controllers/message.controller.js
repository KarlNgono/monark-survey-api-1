import models from "../models/index.js";
import PostgresStorage from "../db-adapters/postgres.js";

const { Contact, Message, Organization, Segment, MessageTemplate, Language } = models;

const surveyStorage = PostgresStorage();

const applyTemplateReplacements = (templateHtml, replacements) => {
    let html = templateHtml;
    Object.keys(replacements).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, "g");
        html = html.replace(regex, replacements[key]);
    });
    return html;
};

const getSurvey = (surveyId) => {
    return new Promise((resolve, reject) => {
        surveyStorage.getSurvey(surveyId, (result) => {
            if (!result) return reject(new Error("Survey not found"));
            resolve(result);
        });
    });
};

export const sendSurveyToContact = async (contactId, surveyId) => {
    const contact = await Contact.findByPk(contactId, {
        include: [
            { model: Organization, as: "organization" },
            { model: Language, as: "language" },
        ],
    });
    if (!contact) throw new Error("Contact not found");

    const survey = await getSurvey(surveyId);
    const languageCode = contact.language?.code_iso2 || "fr";

    const template = await MessageTemplate.findOne({
        where: { language_code: languageCode },
    });
    if (!template) throw new Error(`No template found for ${languageCode}`);

    const defaultOrganizations = { fr: "Votre organisation", en: "Your organization" };
    const defaultDescriptions = { fr: "Merci de remplir ce sondage.", en: "Please fill out this survey." };
    const defaultDeadlines = { fr: "Illimité", en: "Unlimited" };

    const replacements = {
        first_name: contact.first_name,
        organization_name: contact.organization?.organization_name || defaultOrganizations[languageCode],
        survey_name: survey.name,
        survey_description: survey.json?.description || defaultDescriptions[languageCode],
        survey_link: `https://monark-survey.mytalents-academy.com/preview/${survey.id}`,
        deadline: survey.json?.deadline || defaultDeadlines[languageCode],
        support_email: "support@monark.com",
        unsubscribe_link: `https://monark.com/unsubscribe?contact=${contact.id}`,
    };

    const html = applyTemplateReplacements(template.content_html, replacements);
    const subject = applyTemplateReplacements(template.subject, replacements);
    const text = applyTemplateReplacements(template.content_text, replacements);

    const message = await Message.create({
        contact_firstname: contact.first_name,
        contact_type: contact.contact_type,
        contact_value: contact.contact_value,
        subject: subject,
        body_html: html,
        body_text: text,
    });

    return { status: "stored", messageId: message.id };
};

export const sendSurveyToSegment = async (segmentId, surveyId) => {
    const segment = await Segment.findByPk(segmentId, {
        include: [
            {
                model: Contact,
                as: "contacts",
                include: [
                    { model: Organization, as: "organization" },
                    { model: Language, as: "language" },
                ],
            },
        ],
    });
    if (!segment) throw new Error("Segment not found");

    const results = [];

    for (const contact of segment.contacts) {
        try {
            const result = await sendSurveyToContact(contact.id, surveyId);
            results.push({ contactId: contact.id, status: result.status });
        } catch (err) {
            results.push({ contactId: contact.id, status: "failed", error: err.message });
        }
    }

    return results;
};

export const sendContactSurvey = async (req, res) => {
    const { contactId, surveyId } = req.params;
    try {
        const result = await sendSurveyToContact(contactId, surveyId);
        res.json({ message: "Message saved successfully", result });
    } catch (err) {
        console.error("Send survey contact error:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

export const sendSegmentSurvey = async (req, res) => {
    const { segmentId, surveyId } = req.params;
    try {
        const results = await sendSurveyToSegment(segmentId, surveyId);
        res.json({ message: "Messages saved successfully", results });
    } catch (err) {
        console.error("Send survey segment error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
