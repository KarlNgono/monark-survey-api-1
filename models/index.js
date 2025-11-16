import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

import OrganizationModel from "./organization.js";
import DepartmentModel from "./department.js";
import ContactModel from "./contact.js";
import SegmentModel from "./segment.js";
import ContactSegmentModel from "./contactsegment.js";
import MessageModel from "./message.js";
import LinkModel from "./link.js";
import EventAttributesModel from "./eventAttributes.js";
import UsedtokensModel from "./usedtokens.js";

import LanguageModel from "./language.js";
import EmailTemplateModel from "./emailTemplate.js";
import EmailContentModel from "./emailContent.js";
import FeedbackModel from "./feedback.js";

const sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        dialect: "postgres",

        dialectOptions: {
            ssl: process.env.DATABASE_SSL === "true"
                ? { rejectUnauthorized: false }
                : false,
            keepAlive: true
        },

        pool: {
            max: 10,
            min: 0,
            idle: 10000,
            acquire: 30000,
            evict: 10000
        },

        retry: {
            match: [/ECONNRESET/, /ETIMEDOUT/, /EHOSTUNREACH/],
            max: 3
        },

        logging: false
    }
);

const models = {
    Organization: OrganizationModel(sequelize, DataTypes),
    Department: DepartmentModel(sequelize, DataTypes),

    Language: LanguageModel(sequelize, DataTypes),

    Contact: ContactModel(sequelize, DataTypes),
    Segment: SegmentModel(sequelize, DataTypes),
    ContactSegment: ContactSegmentModel(sequelize, DataTypes),

    Message: MessageModel(sequelize, DataTypes),
    Link: LinkModel(sequelize, DataTypes),
    Usedtokens: UsedtokensModel(sequelize, DataTypes),
    EventAttributes: EventAttributesModel(sequelize, DataTypes),

    EmailTemplate: EmailTemplateModel(sequelize, DataTypes),
    EmailContent: EmailContentModel(sequelize, DataTypes),
    Feedback : FeedbackModel(sequelize, DataTypes)
};

Object.values(models).forEach((model) => {
    if (typeof model.associate === "function") {
        model.associate(models);
    }
});

export { sequelize };
export default models;
