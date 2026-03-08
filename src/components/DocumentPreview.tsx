import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Download } from "lucide-react";
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

const DocumentPreview = ({ data, defaultTemplate, onDownloadPDF, trigger }: DocumentPreviewProps) => {
  const { settings } = useBrandSettings();
  const { t } = useLanguage();
  const [template, setTemplate] = useState<TemplateName>(
    (defaultTemplate as TemplateName) || "minimal"
  );

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

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Eye className="mr-1 h-3.5 w-3.5" />{t.quotes.preview}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4">
            <DialogTitle>{t.quotes.preview}: {data.number}</DialogTitle>
            <div className="flex items-center gap-2">
              <Select value={template} onValueChange={(v) => setTemplate(v as TemplateName)}>
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TEMPLATE_LIST.map(tmpl => (
                    <SelectItem key={tmpl} value={tmpl}>{t.templates[tmpl]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" onClick={handleDownload}>
                <Download className="mr-1 h-3.5 w-3.5" />{t.quotes.downloadPDF}
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-auto rounded-lg border border-border bg-white p-2">
          <div
            dangerouslySetInnerHTML={{ __html: html }}
            className="min-h-[600px]"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreview;
