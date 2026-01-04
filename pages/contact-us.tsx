import React, { useState, ChangeEvent, FormEvent } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import { useForms, FormPayload } from "@/hooks/useform";
import SEO from "@/components/seo";
function generateContactUsSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "تماس با وبوفن",
    description: "راه‌های ارتباط با وبوفن برای دریافت مشاوره طراحی سایت، توسعه نرم‌افزار و سیستم‌های اختصاصی",
    url: "https://webofen.com/contact-us",
    mainEntity: {
      "@type": "Organization",
      name: "وبوفن",
      url: "https://webofen.com",
      description: "وبوفن تیم متخصص طراحی سایت، توسعه CMS اختصاصی و راهکارهای نرم‌افزاری",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        telephone: "+982188515914",
        email: "webofenco@gmail.com",
        availableLanguage: ["fa"],
        areaServed: "IR",
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          opens: "09:00",
          closes: "17:00",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
        }
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "تهران - سهروردی شمالی - کوچه مهاجر - پلاک 30",
        addressLocality: "تهران",
        addressCountry: "IR"
      },
      sameAs: [
        "https://instagram.com/webofen",
        "https://t.me/webofenlearn"
      ]
    }
  };
}

const ContactUs = () => {
  interface FormData {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }

  interface ContactInfo {
    icon: React.ReactNode;
    title: string;
    value: string;
  }

  interface FormErrors {
    name?: string;
    phone?: string;
    email?: string;
    message?: string;
  }

  const { submitForm, loading } = useForms();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  
  // Generate schema data
  const contactusSchema = generateContactUsSchema();

  // Helper function to validate Iranian phone numbers
  const isValidIranianPhone = (phone: string): boolean => {
    const cleanedPhone = phone.replace(/[\s\-+]/g, "");

    if (!/^\d+$/.test(cleanedPhone)) {
      return false;
    }

    const mobileRegex = /^(09[0-9]{9})$/;
    const landlineRegex = /^(0[0-9]{10})$/;

    return mobileRegex.test(cleanedPhone) || landlineRegex.test(cleanedPhone);
  };

  // Format phone number as user types
  const formatPhoneNumber = (value: string): string => {
    const phoneNumber = value.replace(/\D/g, "");

    if (phoneNumber.length <= 4) {
      return phoneNumber;
    } else if (phoneNumber.length <= 7) {
      return `${phoneNumber.slice(0, 4)} ${phoneNumber.slice(4)}`;
    } else if (phoneNumber.length <= 11) {
      return `${phoneNumber.slice(0, 4)} ${phoneNumber.slice(
        4,
        7
      )} ${phoneNumber.slice(7)}`;
    } else {
      return `${phoneNumber.slice(0, 4)} ${phoneNumber.slice(
        4,
        8
      )} ${phoneNumber.slice(8, 12)}`;
    }
  };

  const contactInfo: ContactInfo[] = [
    {
      icon: <Mail className="w-5 h-5 text-gray-600" />,
      title: "ایمیل",
      value: "webofenco@gmail.com",
    },
    {
      icon: <Phone className="w-5 h-5 text-gray-600" />,
      title: "تلفن",
      value: "14 59 51 88 - 021",
    },
    {
      icon: <MapPin className="w-5 h-5 text-gray-600" />,
      title: "آدرس",
      value: "تهران - سهروردی شمالی - کوچه مهاجر - پلاک 30",
    },
    {
      icon: <Clock className="w-5 h-5 text-gray-600" />,
      title: "ساعات کاری",
      value: "۹ صبح تا ۵ عصر",
    },
  ];

  const socialMedia = [
    {
      name: "تلگرام",
      href: "https://t.me/webofenlearn",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.78754 14.0196C5.83131 14.0344 5.87549 14.0448 5.91963 14.0512C5.96777 14.1644 6.02996 14.3107 6.10252 14.4818C6.27959 14.8994 6.51818 15.4643 6.76446 16.0535C7.2667 17.2552 7.77332 18.4939 7.88521 18.8485C8.02372 19.2868 8.17013 19.5848 8.32996 19.7883C8.4126 19.8935 8.50819 19.9853 8.62003 20.0549C8.67633 20.0899 8.7358 20.1186 8.79788 20.14C8.80062 20.141 8.80335 20.1419 8.80608 20.1428C9.1261 20.2636 9.41786 20.2133 9.60053 20.1518C9.69827 20.1188 9.77735 20.0791 9.8334 20.0469C9.86198 20.0304 9.88612 20.0151 9.90538 20.0021L9.90992 19.9991L12.7361 18.2366L16.0007 20.7394C16.0488 20.7763 16.1014 20.8073 16.157 20.8316C16.5492 21.0027 16.929 21.0624 17.2862 21.0136C17.6429 20.9649 17.926 20.8151 18.1368 20.6464C18.3432 20.4813 18.4832 20.2963 18.5703 20.1589C18.6148 20.0887 18.6482 20.0266 18.6718 19.9791C18.6836 19.9552 18.6931 19.9346 18.7005 19.9181L18.7099 19.8963L18.7135 19.8877L18.715 19.8841L18.7156 19.8824L18.7163 19.8808C18.7334 19.8379 18.7466 19.7935 18.7556 19.7482L21.7358 4.72274C21.7453 4.67469 21.7501 4.62581 21.7501 4.57682C21.7501 4.13681 21.5843 3.71841 21.1945 3.46452C20.8613 3.24752 20.4901 3.23818 20.2556 3.25598C20.0025 3.27519 19.7688 3.33766 19.612 3.38757C19.5304 3.41355 19.4619 3.43861 19.4126 3.45773C19.3878 3.46734 19.3675 3.47559 19.3523 3.48188L19.341 3.48666L2.62725 10.0432L2.62509 10.044C2.61444 10.0479 2.60076 10.053 2.58451 10.0593C2.55215 10.0719 2.50878 10.0896 2.45813 10.1126C2.35935 10.1574 2.22077 10.2273 2.07856 10.3247C1.85137 10.4803 1.32888 10.9064 1.41686 11.6097C1.48705 12.1708 1.87143 12.5154 2.10562 12.6811C2.23421 12.7721 2.35638 12.8371 2.44535 12.8795C2.48662 12.8991 2.57232 12.9339 2.6095 12.9491L2.61889 12.9529L5.78754 14.0196ZM19.9259 4.86786L19.9236 4.86888C19.9152 4.8725 19.9069 4.87596 19.8984 4.87928L3.1644 11.4438C3.15566 11.4472 3.14686 11.4505 3.138 11.4536L3.12869 11.4571C3.11798 11.4613 3.09996 11.4686 3.07734 11.4788C3.06451 11.4846 3.05112 11.491 3.03747 11.4978C3.05622 11.5084 3.07417 11.5175 3.09012 11.5251C3.10543 11.5324 3.11711 11.5374 3.1235 11.54L6.26613 12.598C6.32365 12.6174 6.37727 12.643 6.42649 12.674L16.8033 6.59948L16.813 6.59374C16.8205 6.58927 16.8305 6.58353 16.8424 6.5768C16.866 6.56345 16.8984 6.54568 16.937 6.52603C17.009 6.48938 17.1243 6.43497 17.2541 6.39485C17.3444 6.36692 17.6109 6.28823 17.899 6.38064C18.0768 6.43767 18.2609 6.56028 18.3807 6.76798C18.4401 6.87117 18.4718 6.97483 18.4872 7.06972C18.528 7.2192 18.5215 7.36681 18.4896 7.49424C18.4208 7.76875 18.228 7.98287 18.0525 8.14665C17.9021 8.28706 15.9567 10.1629 14.0376 12.0147C13.0805 12.9381 12.1333 13.8525 11.4252 14.5359L10.9602 14.9849L16.8321 19.4867C16.9668 19.5349 17.0464 19.5325 17.0832 19.5274C17.1271 19.5214 17.163 19.5045 17.1997 19.4752C17.2407 19.4424 17.2766 19.398 17.3034 19.3557L17.3045 19.354L20.195 4.78102C20.1521 4.79133 20.1087 4.80361 20.0669 4.81691C20.0196 4.83198 19.9805 4.84634 19.9547 4.85637C19.9418 4.86134 19.9326 4.86511 19.9276 4.86719L19.9259 4.86786ZM11.4646 17.2618L10.2931 16.3636L10.0093 18.1693L11.4646 17.2618ZM9.21846 14.5814L10.3834 13.4567C11.0915 12.7732 12.0389 11.8588 12.9961 10.9352L13.9686 9.997L7.44853 13.8138L7.48351 13.8963C7.66121 14.3154 7.90087 14.8827 8.14845 15.4751C8.33358 15.918 8.52717 16.3844 8.70349 16.8162L8.98653 15.0158C9.01381 14.8422 9.09861 14.692 9.21846 14.5814Z"
            fill="white"
          ></path>
        </svg>
      ),
      color: "hover:bg-gray-100",
    },
    {
      name: "اینستاگرام",
      href: "https://instagram.com/webofen",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 192 192"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke="white"
            strokeWidth="12"
            d="M96 162c-14.152 0-24.336-.007-32.276-.777-7.849-.761-12.87-2.223-16.877-4.741a36 36 0 0 1-11.33-11.329c-2.517-4.007-3.98-9.028-4.74-16.877C30.007 120.336 30 110.152 30 96c0-14.152.007-24.336.777-32.276.76-7.849 2.223-12.87 4.74-16.877a36 36 0 0 1 11.33-11.33c4.007-2.517 9.028-3.98 16.877-4.74C71.663 30.007 81.847 30 96 30c14.152 0 24.336.007 32.276.777 7.849.76 12.87 2.223 16.877 4.74a36 36 0 0 1 11.329 11.33c2.518 4.007 3.98 9.028 4.741 16.877.77 7.94.777 18.124.777 32.276 0 14.152-.007 24.336-.777 32.276-.761 7.849-2.223 12.87-4.741 16.877a36 36 0 0 1-11.329 11.329c-4.007 2.518-9.028 3.98-16.877 4.741-7.94.77-18.124.777-32.276.777Z"
          ></path>
          <circle
            cx="96"
            cy="96"
            r="30"
            stroke="white"
            strokeWidth="12"
          ></circle>
          <circle cx="135" cy="57" r="9" fill="white"></circle>
        </svg>
      ),
      color: "hover:bg-gray-100",
    },
    {
      name: "لینکدین",
      href: "#",
      icon: (
        <svg
          width="15"
          height="20"
          viewBox="0 0 20 20"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          fill="white"
        >
          <defs> </defs>
          <g
            id="Page-1"
            stroke="none"
            strokeWidth="1"
            fill="white"
            fillRule="evenodd"
          >
            <g
              id="Dribbble-Light-Preview"
              transform="translate(-180.000000, -7479.000000)"
              fill="white"
            >
              <g id="icons" transform="translate(56.000000, 160.000000)">
                <path
                  d="M144,7339 L140,7339 L140,7332.001 C140,7330.081 139.153,7329.01 137.634,7329.01 C135.981,7329.01 135,7330.126 135,7332.001 L135,7339 L131,7339 L131,7326 L135,7326 L135,7327.462 C135,7327.462 136.255,7325.26 139.083,7325.26 C141.912,7325.26 144,7326.986 144,7330.558 L144,7339 L144,7339 Z M126.442,7323.921 C125.093,7323.921 124,7322.819 124,7321.46 C124,7320.102 125.093,7319 126.442,7319 C127.79,7319 128.883,7320.102 128.883,7321.46 C128.884,7322.819 127.79,7323.921 126.442,7323.921 L126.442,7323.921 Z M124,7339 L129,7339 L129,7326 L124,7326 L124,7339 Z"
                  id="linkedin-[#161]"
                >
                </path>
              </g>
            </g>
          </g>
        </svg>
      ),
      color: "hover:bg-gray-100",
    },
    {
      name: "توییتر",
      href: "#",
      icon: (
        <svg
          width="20"
          height="20"
          fill="white"
          viewBox="0 0 1920 1920"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1643.825 518.606c-14.457 11.294-22.588 28.8-21.685 47.096.565 16.377 1.017 32.753 1.017 49.355 0 530.372-373.497 1079.153-998.513 1079.153-122.203 0-242.598-24.282-355.765-71.153 136.433-22.588 266.428-82.447 374.965-173.816 17.957-15.247 24.62-39.868 16.828-62.005-7.793-22.136-28.574-37.157-52.179-37.722-105.374-2.146-200.81-62.682-256.376-157.214 38.06-1.13 79.059-7.116 109.779-16.038 24.847-7.228 41.562-30.381 40.771-56.132-.903-25.863-19.2-47.774-44.499-53.308-112.15-24.282-194.71-116.781-222.607-243.84 32.076 6.438 62.344 8.47 79.06 8.922 24.62 2.711 47.322-14.456 55.453-38.06 8.02-23.492-.226-49.582-20.442-64.151-78.042-56.245-161.619-161.167-161.619-286.42 0-30.832 3.84-61.326 11.181-90.804 195.163 217.186 461.478 348.31 743.83 363.558 18.975 1.016 34.674-6.438 46.08-19.765 11.408-13.327 15.926-31.398 12.312-48.565-5.648-25.637-8.471-52.178-8.471-79.058 0-188.951 141.063-342.664 314.428-342.664 87.19 0 168.283 37.835 228.141 106.73 13.327 15.36 34.334 22.475 54.212 18.183 28.687-6.099 56.922-13.779 84.706-23.153-16.49 16.715-34.673 31.624-54.438 44.386-22.25 14.343-31.51 42.014-22.475 66.861s34.56 39.868 60.31 36.593c14.683-1.92 29.252-4.179 43.709-7.002-18.297 17.731-37.497 34.447-57.713 50.033m261.685-199.68c-16.716-18.636-43.596-23.83-66.41-13.214-4.066 1.92-8.132 3.84-12.31 5.76 17.054-30.269 30.946-62.683 40.997-96.678 6.777-22.588-1.242-46.984-20.103-61.214-18.974-14.118-44.5-15.247-64.49-2.485-58.277 37.384-120.96 64.828-186.466 82.108-78.268-76.8-181.948-120.17-289.355-120.17-235.595 0-427.37 204.424-427.37 455.606 0 9.487.227 18.974.791 28.348C626 564.008 390.517 424.977 226.64 208.469c-11.52-15.247-30.155-23.04-49.242-22.136-19.2 1.468-36.367 12.536-45.516 29.477-37.157 68.894-56.809 147.614-56.809 227.464 0 86.626 28.687 165.007 70.25 230.739-19.426 9.035-32.98 28.574-32.98 51.388v5.195c0 139.821 49.808 261.91 133.497 344.47-9.035 2.937-17.28 8.246-23.943 15.36a56.566 56.566 0 0 0-12.537 54.326c40.772 136.997 137.788 242.145 258.41 289.807-122.88 69.571-268.688 97.129-404.443 80.753-26.541-3.953-50.485 11.858-59.633 36.028-9.261 24.282-.677 51.84 20.781 66.522 179.69 123.784 387.276 189.29 600.17 189.29 695.717 0 1111.454-606.156 1111.454-1192.095 0-8.583-.113-17.054-.339-25.524 68.555-57.149 127.51-125.365 175.737-203.069 13.214-21.345 10.842-48.903-5.986-67.538"
            fillRule="evenodd"
          ></path>
        </svg>
      ),
      color: "hover:bg-gray-100",
    },
  ];

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const formattedValue = formatPhoneNumber(value);
      setFormData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "نام را وارد کنید";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "شماره تلفن را وارد کنید";
    } else {
      const phoneWithoutSpaces = formData.phone.replace(/[\s\-]/g, "");

      if (!/^\d+$/.test(phoneWithoutSpaces)) {
        newErrors.phone = "شماره تلفن باید فقط شامل اعداد باشد";
      }
      else if (phoneWithoutSpaces.length !== 11) {
        newErrors.phone = "شماره تلفن باید ۱۱ رقمی باشد (مثال: ۰۹۱۲۳۴۵۶۷۸۹)";
      }
      else if (!isValidIranianPhone(phoneWithoutSpaces)) {
        newErrors.phone =
          "شماره تلفن معتبر نیست. فرمت صحیح: ۰۹۱۲۳۴۵۶۷۸۹ یا ۰۲۱۱۲۳۴۵۶۷۸";
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = "ایمیل را وارد کنید";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "ایمیل معتبر نیست";
    }

    if (!formData.message.trim()) {
      newErrors.message = "پیام را وارد کنید";
    }

    return newErrors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const cleanPhone = formData.phone.replace(/[\s\-]/g, "");

    const payload: FormPayload = {
      title: "تماس با ما",
      fields: [
        { label: "نام و نام خانوادگی", type: "text", content: formData.name },
        { label: "ایمیل", type: "email", content: formData.email },
        {
          label: "شماره تلفن",
          type: "text",
          content: cleanPhone || "ثبت نشده",
        },
        {
          label: "موضوع",
          type: "text",
          content: formData.subject || "ثبت نشده",
        },
        { label: "پیام", type: "textarea", content: formData.message },
      ],
    };

    const result = await submitForm(payload);

    if (result) {
      setIsSubmitted(true);
      setShowSuccessModal(true);

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      setErrors({});
    }
  };

  const getInputClass = (hasError: boolean) =>
    `w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-[#29b0cb] focus:border-transparent ${
      hasError ? "border-red-300 bg-red-50" : "border-gray-300"
    }`;

  return (
    <>
       <SEO
      title="تماس با وبوفن | دریافت مشاوره طراحی سایت و توسعه نرم‌افزار"
      description="برای دریافت مشاوره طراحی سایت اختصاصی، توسعه CMS و راهکارهای نرم‌افزاری با تیم وبوفن در تماس باشید. پاسخ‌گویی سریع و تخصصی."
      keywords="تماس با وبوفن, مشاوره طراحی سایت, ارتباط با وبوفن, پشتیبانی طراحی سایت, مشاوره CMS اختصاصی"
      canonical="https://webofen.com/contact-us"
      ogType="website"
      ogImage="https://webofen.com/images/og-contact.jpg"
      structuredData={contactusSchema} 
    />

      {/* Structured Data Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactusSchema) }}
      />
      <main>
        {/* Contact Form Section */}
        <section className="pb-4 w-full">
          <div className="max-w-[1250px] m-auto flex flex-col lg:flex-row gap-8 md:py-20 md:px-0 px-4">
            {/* Contact Information */}
            <div className="lg:w-1/3 space-y-8">
              <div className="mb-6">
                <h1 className="text-[#0364af] text-4xl font-semibold md:pt-0 pt-6">
                  تماس با ما
                </h1>
              </div>

              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100"
                  >
                    <div className="p-3 bg-[#f7f8fc] rounded-lg">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Media */}
              <div className="pt-4 border-t border-gray-200">
                <h2 className="font-medium text-gray-800 mb-4 text-lg">
                  شبکه‌های اجتماعی
                </h2>
                <div className="flex gap-3">
                  {socialMedia.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className="w-12 h-12 rounded-full flex items-center justify-center text-gray-500 bg-[#1d546b] hover:bg-[#29b0cb] transition-colors duration-200"
                      aria-label={social.name}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                <div className="mb-8">
                  <h2 className="text-2xl font-normal text-gray-900 mb-3">
                    ارسال پیام
                  </h2>
                  <p className="text-gray-500">
                    فرم زیر را پر کنید تا با شما تماس بگیریم
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-500">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        نام و نام خانوادگی *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={getInputClass(!!errors.name)}
                        placeholder="مثال: علی محمدی"
                      />
                      {errors.name && (
                        <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ایمیل *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={getInputClass(!!errors.email)}
                        placeholder="example@email.com"
                        dir="ltr"
                      />
                      {errors.email && (
                        <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-500">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        شماره تماس *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={getInputClass(!!errors.phone)}
                        placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                        inputMode="numeric"
                        maxLength={13} // 11 digits + 2 spaces for formatting
                      />
                      {errors.phone && (
                        <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        موضوع
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={getInputClass(false)}
                        placeholder="موضوع پیام خود را وارد کنید"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      پیام شما *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className={`${getInputClass(
                        !!errors.message
                      )} text-gray-500 resize-none`}
                      placeholder="متن پیام خود را اینجا بنویسید..."
                    />
                    {errors.message && (
                      <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 px-6 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 text-lg relative overflow-hidden ${
                      loading
                        ? "bg-gray-300 cursor-not-allowed text-gray-500"
                        : "bg-[#29b0cb] hover:bg-orange-400 text-white group"
                    }`}
                  >
                    {/* Shimmer effect */}
                    {!loading && (
                      <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    )}

                    {/* Shadow animation */}
                    {!loading && (
                      <span className="absolute inset-0 rounded-lg shadow-lg group-hover:shadow-xl group-hover:shadow-orange-400/30 transition-shadow duration-300" />
                    )}

                    {/* Content with bounce animation */}
                    <span className="relative flex items-center gap-2">
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          در حال ارسال...
                        </>
                      ) : (
                        <>
                          <span className="group-hover:scale-105 transition-transform duration-300">
                            ارسال پیام
                          </span>
                        </>
                      )}
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="pb-4 w-full bg-[#f7f8fc] rounded-2xl">
          <div className="max-w-[1250px] m-auto md:py-20 py-10  md:px-0 px-4">
            <div className="mb-12 text-center">
              <h2 className="text-[#0364af] text-lg">موقعیت ما</h2>
              <h2 className="text-[#6fd6e5] text-3xl mt-2">دفتر مرکزی</h2>
            </div>

            <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden bg-gray-100">
              {/* Map Placeholder */}
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    تهران - سهروردی شمالی - کوچه مهاجر - پلاک 30
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    برای دیدن نقشه دقیق، روی این ناحیه کلیک کنید
                  </p>
                </div>
              </div>

              {/* You can add a real map component here */}
              <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-[#0364af] to-[#29b0cb]"></div>
            </div>
          </div>
        </section>

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md text-center shadow-xl animate-fadeIn">
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-[#6FD6E5]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-700 text-lg mb-5">
                فرم شما با موفقیت ارسال شد. <br />
                همکاران ما در اسرع وقت با شما تماس خواهند گرفت.
              </p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-6 py-2 bg-[#6FD6E5] text-white rounded-full font-medium hover:bg-[#5ac7d7] transition-colors duration-200"
              >
                متوجه شدم
              </button>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out;
          }

          select {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
            background-position: left 0.75rem center;
            background-repeat: no-repeat;
            background-size: 1em 1em;
            padding-left: 2.5rem;
          }
        `}</style>
      </main>
    </>
  );
};

export default ContactUs;
