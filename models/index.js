import {Sequelize, DataTypes} from "sequelize";
import dotenv from "dotenv";

dotenv.config();

import OrganizationModel from "./organization.js";
import DepartmentModel from "./department.js";
import ContactModel from "./contact.js";
import PositionModel from "./position.js";
import LanguageModel from "./language.js";
import SegmentModel from "./segment.js";
import ContactSegmentModel from "./contactsegment.js";
import MessageModel from "./message.js";
import MessageTemplateModel from "./messageTemplate.js"

const sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        dialect: 'postgres',
        ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
        logging: false,
    }
);

const models = {
    Organization: OrganizationModel(sequelize, DataTypes),
    Department: DepartmentModel(sequelize, DataTypes),
    Contact: ContactModel(sequelize, DataTypes),
    Position: PositionModel(sequelize, DataTypes),
    Language: LanguageModel(sequelize, DataTypes),
    Segment: SegmentModel(sequelize, DataTypes),
    ContactSegment: ContactSegmentModel(sequelize, DataTypes),
    Message: MessageModel(sequelize, DataTypes),
    MessageTemplate: MessageTemplateModel(sequelize, DataTypes)
};

Object.values(models).forEach((model) => {
    if (model.associate) {
        model.associate(models);
    }
});

export {sequelize};
export default models;
