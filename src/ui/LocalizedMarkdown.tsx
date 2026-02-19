import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

type LocalizedMarkdownProps = {
  pathBase: string;
  language: string;
  fallbackLanguage?: string;
};

export default function LocalizedMarkdown(props: LocalizedMarkdownProps) {
  const [content, setContent] = useState("");

  useEffect(() => {
    let canceled = false;
    const fallbackLanguage = props.fallbackLanguage ?? "en";
    const baseUrl = import.meta.env.BASE_URL;
    const normalizedLanguage = props.language.split("-")[0];
    const candidates = [
      props.language,
      normalizedLanguage,
      fallbackLanguage,
    ].filter((v, i, arr) => v && arr.indexOf(v) === i);
    const paths = candidates.map(
      (lang) => `${baseUrl}content/${lang}/${props.pathBase}.md`,
    );

    const load = async () => {
      for (const path of paths) {
        try {
          const res = await fetch(path);
          if (res.ok) {
            const text = await res.text();
            if (!canceled) {
              setContent(text);
            }
            return;
          }
        } catch {
          // Try next candidate language file.
        }
      }
      if (!canceled) {
        setContent("");
      }
    };

    void load();
    return () => {
      canceled = true;
    };
  }, [props.fallbackLanguage, props.language, props.pathBase]);

  return <ReactMarkdown>{content}</ReactMarkdown>;
}
