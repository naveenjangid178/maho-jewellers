import { Admin } from "../models/admin.model.js";

export const seedDefaultAdmin = async () => {
    const defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL;

    const existingAdmin = await Admin.findOne({ email: defaultAdminEmail });
    if (existingAdmin) {
        console.log("✅ Default admin already exists.");
    } else {
        await Admin.create({
            name: "Maho Jewellers",
            email: defaultAdminEmail,
            password: process.env.DEFAULT_ADMIN_PASSWORD,
        });

        console.log("✅ Default admin created successfully.");
    }
};