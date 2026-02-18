import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

type LocalizedMarkdownProps = {
  pathBase: string;
  language: string;
  fallbackLanguage?: string;
};

export default function LocalizedMarkdown(props: LocalizedMarkdownProps) {
  const [content, setContent] = useState('');

  useEffect(() => {
    let canceled = false;
    const fallbackLanguage = props.fallbackLanguage ?? 'en';
    const paths = [`/content/${props.language}/${props.pathBase}.md`, `/content/${fallbackLanguage}/${props.pathBase}.md`];

    const load = async () => {
      for (const path of paths) {
        const res = await fetch(path);
        if (res.ok) {
          const text = await res.text();
          if (!canceled) {
            setContent(text);
          }
          return;
        }
      }
      if (!canceled) {
        setContent('');
      }
    };

    void load();
    return () => {
      canceled = true;
    };
  }, [props.fallbackLanguage, props.language, props.pathBase]);

  return <ReactMarkdown>{content}</ReactMarkdown>;
}
