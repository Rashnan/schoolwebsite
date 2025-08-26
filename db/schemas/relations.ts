import { relations } from "drizzle-orm";
import { registrations } from "./registrations";
import { runners } from "./runners";
import { discounts } from "./discounts";

export const registrationsRelations = relations(registrations, ({ many, one }) => ({
    runners: many(runners),
    discount: one(discounts, {
        fields: [registrations.discountId],
        references: [discounts.id],
    }),
}));

export const runnersRelations = relations(runners, ({ one }) => ({
    registration: one(registrations, {
        fields: [runners.registrationId],
        references: [registrations.id],
    }),
}));

export const discountsRelations = relations(discounts, ({ many }) => ({
    registrations: many(registrations),
}));
