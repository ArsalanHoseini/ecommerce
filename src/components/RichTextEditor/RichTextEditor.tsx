"use client";

import React from "react";
import { Editor } from "@tinymce/tinymce-react";

interface RichTextEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  label?: string;
  height?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  label = "ویرایشگر متن",
  height = 400,
}) => {
  // 📦 خواندن API Key از محیط (env)
  const apiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY;

  console.log("🔑 TinyMCE API Key:", apiKey);

  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 block">
          {label}
        </label>
      )}

      <Editor
        apiKey={apiKey}
        value={value}
        init={{
          height,
          menubar: false,
          directionality: "rtl",
          language: "fa",
          skin: "oxide-dark",
          content_css: "dark",
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "wordcount",
            "fontsize",
          ],
          toolbar:
            "undo redo | fontsize | blocks | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist | link image media table | removeformat | code",
          content_style:
            "body { font-family: Vazirmatn, Tahoma, sans-serif; direction: rtl; text-align: right; line-height: 1.8; }",

          /* 🎯 اتصال به فایل‌منیجر اختصاصی سایت */
          file_picker_callback: function (callback, value, meta) {
            const fileManagerURL = "/file-manager?type=" + meta.filetype;

            const x = window.innerWidth / 2 - 800 / 2;
            const y = window.innerHeight / 2 - 600 / 2;
            const fileManagerWindow = window.open(
              fileManagerURL,
              "File Manager",
              "width=800,height=600,left=" + x + ",top=" + y
            );

            window.addEventListener("message", function receiveMessage(event) {
              if (event.origin !== window.location.origin) return;
              if (event.data.fileUrl) {
                callback(event.data.fileUrl);
                window.removeEventListener("message", receiveMessage);
              }
            });
          },
        }}
        onEditorChange={(newValue) => onChange?.(newValue)}
      />
    </div>
  );
};

export default RichTextEditor;
