"use client";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { ar } from "date-fns/locale";
import { useLocale } from "next-globe-gen";

// Register Arabic locale once when the component is first imported
registerLocale("ar", ar);

export default function LocalizedDatePicker(props: any) {
  const locale = useLocale();

  return (
    <DatePicker
      {...props}
      locale={locale === "ar" ? "ar" : undefined}
      calendarStartDay={locale === "ar" ? 6 : 0}
    />
  );
}
