import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";
import { generateTemplateHTML, TEMPLATE_LIST, TemplateName, DocumentData } from "./DocumentTemplates";
import { useBrandSettings } from "@/hooks/useBrandSettings";
import { useLanguage } from "@/i18n/LanguageContext";

interface DocumentPreviewProps {
  data: DocumentData;
  defaultTemplate?: string;
  onDownloadPDF?: (template: TemplateName) => void;
  trigger?: React.ReactNode;
}

const TEMPLATE_DESCRIPTIONS: Record<TemplateName, string> = {
  minimal: "Clean & light",
  classic: "Traditional serif",
  bold: "Gradient header",
  elegant: "Centered & refined",
  compact: "Dense & efficient",
};

const DocumentPreview = ({ data, defaultTemplate, onDownloadPDF, trigger }: DocumentPreviewProps) => {
  const { settings } = useBrandSettings();
  const { t } = useLanguage();
  const [template, setTemplate] = useState<TemplateName>(
    (defaultTemplate as TemplateName) || "minimal"
  );

  const currentIndex = TEMPLATE_LIST.indexOf(template);

  const html = useMemo(
    () => generateTemplateHTML(template, data, settings),
    [template, data, settings]
  );

  const handleDownload = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>${data.number}</title>
      <style>@media print{body{margin:0;padding:0}}</style>
      </head><body>${html}<script>window.print();</script></body></html>
    `);
    printWindow.document.close();
    onDownloadPDF?.(template);
  };

  const prevTemplate = () => {
    const idx = (currentIndex - 1 + TEMPLATE_LIST.length) % TEMPLATE_LIST.length;
    setTemplate(TEMPLATE_LIST[idx]);
  };

  const nextTemplate = () => {
    const idx = (currentIndex + 1) % TEMPLATE_LIST.length;
    setTemplate(TEMPLATE_LIST[idx]);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Eye className="mr-1 h-3.5 w-3.5" />{t.quotes.preview}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col gap-0">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="text-base font-semibold">{data.number}</DialogTitle>
            <Button size="sm" variant="outline" onClick={handleDownload} className="shrink-0">
              <Download className="mr-1.5 h-3.5 w-3.5" />{t.quotes.downloadPDF}
            </Button>
          </div>
        </DialogHeader>

        {/* Template switcher strip */}
        <div className="flex items-center gap-2 border-t border-b border-border py-2.5 px-1">
          <button onClick={prevTemplate} className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex flex-1 gap-1.5 overflow-x-auto scrollbar-none">
            {TEMPLATE_LIST.map((tmpl) => (
              <button
                key={tmpl}
                onClick={() => setTemplate(tmpl)}
                className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  tmpl === template
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {t.templates[tmpl]}
              </button>
            ))}
          </div>
          <button onClick={nextTemplate} className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <p className="text-[11px] text-muted-foreground pt-2 pb-1">{TEMPLATE_DESCRIPTIONS[template]}</p>

        {/* Preview area */}
        <div className="flex-1 overflow-auto rounded-lg border border-border bg-white mt-1">
          <div
            dangerouslySetInnerHTML={{ __html: html }}
            className="min-h-[500px]"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreview;
