// @/components/shared/forms/InventoryForm.tsx

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
import type { InventoryFormProps } from "@/types/features/inventory";
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
import { getSchemaForVariant } from "@/lib/schemas/inventory";

const RequiredIndicator = () => <span className="text-red-500 ml-1">*</span>;

export function InventoryForm({
  variant,
  initialData,
  onSubmit,
  onCancel,
}: InventoryFormProps) {
  const { language } = useLanguage();
    const formT = translations[language].dashboard.inventory.form;  
    const schema = getSchemaForVariant(variant, language);

  const { data: locations } = useInventory({
    endpoint: "locations",
  });

  const { data: categories } = useInventory({
    endpoint: "categories",
  });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      name: "",
      description: "",
      active: true,
      ...(variant === "location" && {
        address: "",
        contactNumber: "",
      }),
      ...(variant === "category" && {
        locationId: "",
      }),
      ...(variant === "item" && {
        price: 0,
        quantity: 0,
        categoryId: "",
      }),
    },
  });

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
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location variant fields */}
        {variant === "location" && (
          <>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-4">
                    <FormLabel className="w-1/4 text-right">
                      {formT.address}
                      <RequiredIndicator />
                    </FormLabel>
                    <FormControl className="w-3/4">
                      <Input
                        {...field}
                        placeholder={formT.addressPlaceholder}
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
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-4">
                    <FormLabel className="w-1/4 text-right">
                      {formT.contactNumber}
                      <RequiredIndicator />
                    </FormLabel>
                    <FormControl className="w-3/4">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center px-3 h-10 border border-r-0 rounded-l-md border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                          +251
                        </div>
                        <Input
                          {...field}
                          type="tel"
                          placeholder={formT.contactNumberPlaceholder}
                          className="h-10 rounded-l-none"
                          maxLength={9}
                          minLength={9}
                          pattern="[0-9]{9,10}"
                        />
                      </div>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {/* Category variant fields */}
        {variant === "category" && (
          <>
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
              name="locationId"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-4">
                    <FormLabel className="w-1/4 text-right">
                      {formT.location}
                      <RequiredIndicator />
                    </FormLabel>
                    <FormControl className="w-3/4">
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-10 w-3/4">
                          <SelectValue
                            placeholder={formT.locationPlaceholder}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {locations
                            ?.filter((location) => location.active)
                            .map((location) => (
                              <SelectItem key={location.id} value={location.id}>
                                {location.name}
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
          </>
        )}

        {/* Item variant fields */}
        {variant === "item" && (
          <>
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-4">
                    <FormLabel className="w-1/4 text-right">
                      {formT.category}
                      <RequiredIndicator />
                    </FormLabel>
                    <FormControl className="w-3/4">
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-10 w-3/4">
                          <SelectValue
                            placeholder={formT.categoryPlaceholder}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {categories
                            ?.filter((category) => category.active)
                            .map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
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

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-4">
                    <FormLabel className="w-1/4 text-right">
                      {formT.price}
                      <RequiredIndicator />
                    </FormLabel>
                    <FormControl className="w-3/4">
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder={formT.pricePlaceholder}
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
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-4">
                    <FormLabel className="w-1/4 text-right">
                      {formT.quantity}
                      <RequiredIndicator />
                    </FormLabel>
                    <FormControl className="w-3/4">
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        step="1"
                        placeholder={formT.quantityPlaceholder}
                        className="h-10"
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value, 10))
                        }
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

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
