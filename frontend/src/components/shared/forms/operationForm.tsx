// @/components/shared/forms/operationForm.tsx

"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/components/context/LanguageContext";
import { translations } from "@/translations";
import { useInventory } from "@/hooks/features/useInventory";
import type { OperationFormProps } from "@/types/features/operation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getSchemaForVariant } from "@/lib/schemas/operation";

const RequiredIndicator = () => <span className="text-red-500 ml-1">*</span>;

export function OperationForm({
  variant,
  initialData,
  onSubmit,
  onCancel,
}: OperationFormProps) {
  const { language } = useLanguage();
  const formT = translations[language].dashboard.form;

  // Fetch branches for the branch select field
  const { data: branches } = useInventory({
    endpoint: "branches",
  });

  const schema = getSchemaForVariant(variant, language);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      name: "",
      active: true,
      branchId: "",
      ...(variant === "user" && {
        username: "",
        email: "",
        phone: "",
        role: "",
      }),
      ...(variant === "expense" && {
        amount: 0,
        description: "",
        frequency: "",
      }),
    },
  });

  const generateUsername = (fullName: string) => {
    const formattedName = fullName
      .toLowerCase()
      .replace(/[^a-z\s]/g, "")
      .trim()
      .split(/\s+/)
      .filter((part) => part.length > 0);

    if (formattedName.length >= 2) {
      return `${formattedName[0]}.${formattedName[formattedName.length - 1]}`;
    } else if (formattedName.length === 1) {
      return formattedName[0];
    }
    return "";
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Common fields for all variants */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-4">
                <FormLabel className="w-1/4 text-right">
                  {formT.name}
                  <RequiredIndicator />
                </FormLabel>
                <FormControl className="w-3/4">
                  <Input
                    {...field}
                    placeholder={formT.namePlaceholder}
                    className="h-10"
                    onChange={(e) => {
                      field.onChange(e);
                      if (variant === "user") {
                        const generatedUsername = generateUsername(
                          e.target.value
                        );
                        form.setValue("username", generatedUsername);
                      }
                    }}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* User variant fields */}
        {variant === "user" && (
          <>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-4">
                    <FormLabel className="w-1/4 text-right">
                      {formT.username}
                      <RequiredIndicator />
                    </FormLabel>
                    <FormControl className="w-3/4">
                      <Input
                        {...field}
                        placeholder={formT.usernamePlaceholder}
                        className="h-10 bg-neutral-100 dark:bg-neutral-800"
                        readOnly
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-4">
                    <FormLabel className="w-1/4 text-right">
                      {formT.email}
                      <RequiredIndicator />
                    </FormLabel>
                    <FormControl className="w-3/4">
                      <Input
                        {...field}
                        type="email"
                        placeholder={formT.emailPlaceholder}
                        className="h-10"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-4">
                    <FormLabel className="w-1/4 text-right">
                      {formT.phone}
                      <RequiredIndicator />
                    </FormLabel>
                    <FormControl className="w-3/4">
                      <Input
                        {...field}
                        type="tel"
                        placeholder={formT.phonePlaceholder}
                        className="h-10"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-4">
                    <FormLabel className="w-1/4 text-right">
                      {formT.role}
                      <RequiredIndicator />
                    </FormLabel>
                    <FormControl className="w-3/4">
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-10 w-3/4">
                          <SelectValue placeholder={formT.rolePlaceholder} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">{formT.admin}</SelectItem>
                          <SelectItem value="sales">{formT.sales}</SelectItem>
                          <SelectItem value="warehouse">
                            {formT.warehouse}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {/* Expense variant fields */}
        {variant === "expense" && (
          <>
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-4">
                    <FormLabel className="w-1/4 text-right">
                      {formT.amount}
                      <RequiredIndicator />
                    </FormLabel>
                    <FormControl className="w-3/4">
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder={formT.amountPlaceholder}
                        className="h-10"
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-4">
                    <FormLabel className="w-1/4 text-right">
                      {formT.description}
                    </FormLabel>
                    <FormControl className="w-3/4">
                      <Textarea
                        {...field}
                        placeholder={formT.descriptionPlaceholder}
                        className="h-20"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-4">
                    <FormLabel className="w-1/4 text-right">
                      {formT.frequency}
                      <RequiredIndicator />
                    </FormLabel>
                    <FormControl className="w-3/4">
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-10 w-3/4">
                          <SelectValue
                            placeholder={formT.frequencyPlaceholder}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="once">{formT.oneTime}</SelectItem>
                          <SelectItem value="daily">{formT.daily}</SelectItem>
                          <SelectItem value="weekly">{formT.weekly}</SelectItem>
                          <SelectItem value="monthly">
                            {formT.monthly}
                          </SelectItem>
                          <SelectItem value="quarterly">
                            {formT.quarterly}
                          </SelectItem>
                          <SelectItem value="halfYearly">
                            {formT.halfYearly}
                          </SelectItem>
                          <SelectItem value="yearly">{formT.yearly}</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="branchId"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-4">
                <FormLabel className="w-1/4 text-right">
                  {formT.branch}
                  <RequiredIndicator />
                </FormLabel>
                <FormControl className="w-3/4">
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-10 w-3/4">
                      <SelectValue placeholder={formT.branchPlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {branches
                        ?.filter((branch) => branch.active)
                        .map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Common active field for all variants */}
        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-4">
                <FormLabel className="w-1/4 text-right">
                  {formT.active}
                </FormLabel>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            {formT.cancel}
          </Button>
          <Button type="submit">
            {initialData ? formT.update : formT.create}
          </Button>
        </div>
      </form>
    </Form>
  );
}