import PDFDocument from "pdfkit";
import { Readable } from "stream";
import { DeliveryTerm } from "../drizzle/schema";

export interface DeliveryTermPDFData extends DeliveryTerm {
  inspectionTitle?: string;
  companyName?: string;
}

export async function generateDeliveryTermPDF(
  data: DeliveryTermPDFData
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
    });

    doc.on("end", () => {
      resolve(Buffer.concat(chunks));
    });

    doc.on("error", reject);

    // Header
    doc
      .fontSize(24)
      .font("Helvetica-Bold")
      .text("TERMO DE ENTREGA", { align: "center" });

    doc.moveDown(0.5);

    // Protocol and Date
    doc.fontSize(10).font("Helvetica");
    doc.text(`Número de Protocolo: ${data.protocolNumber}`, {
      align: "left",
    });
    doc.text(
      `Data de Conclusão: ${new Date(data.completionDate).toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      { align: "left" }
    );

    doc.moveDown(1);

    // Divider line
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(0.5);

    // Company and Inspection Info
    doc.fontSize(11).font("Helvetica-Bold").text("INFORMAÇÕES DA VISTORIA");
    doc.fontSize(10).font("Helvetica");

    if (data.companyName) {
      doc.text(`Empresa: ${data.companyName}`);
    }

    if (data.inspectionTitle) {
      doc.text(`Vistoria: ${data.inspectionTitle}`);
    }

    doc.moveDown(0.5);

    // Responsible Technician
    doc.fontSize(11).font("Helvetica-Bold").text("RESPONSÁVEL TÉCNICO");
    doc.fontSize(10).font("Helvetica");
    doc.text(data.responsibleTechnician);

    doc.moveDown(1);

    // Description
    if (data.description) {
      doc.fontSize(11).font("Helvetica-Bold").text("DESCRIÇÃO");
      doc.fontSize(10).font("Helvetica");
      doc.text(data.description, { align: "justify" });
      doc.moveDown(1);
    }

    // Signature area
    doc.fontSize(11).font("Helvetica-Bold").text("ASSINATURA DIGITAL");
    doc.fontSize(10).font("Helvetica");

    if (data.digitalSignature) {
      doc.text("✓ Assinado digitalmente");
      doc.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`);
    } else {
      doc.moveDown(2);
      doc.text("_________________________________");
      doc.text("Assinatura do Responsável Técnico");
    }

    doc.moveDown(2);

    // Footer
    doc.fontSize(8).font("Helvetica").text(
      "Este documento foi gerado automaticamente pelo sistema de Gestão de Obras.",
      { align: "center" }
    );

    doc.end();
  });
}

export function generateDeliveryTermPDFStream(
  data: DeliveryTermPDFData
): PDFKit.PDFDocument {
  const doc = new PDFDocument({
    size: "A4",
    margin: 50,
  });

  // Header
  doc
    .fontSize(24)
    .font("Helvetica-Bold")
    .text("TERMO DE ENTREGA", { align: "center" });

  doc.moveDown(0.5);

  // Protocol and Date
  doc.fontSize(10).font("Helvetica");
  doc.text(`Número de Protocolo: ${data.protocolNumber}`, {
    align: "left",
  });
  doc.text(
    `Data de Conclusão: ${new Date(data.completionDate).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })}`,
    { align: "left" }
  );

  doc.moveDown(1);

  // Divider line
  doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
  doc.moveDown(0.5);

  // Company and Inspection Info
  doc.fontSize(11).font("Helvetica-Bold").text("INFORMAÇÕES DA VISTORIA");
  doc.fontSize(10).font("Helvetica");

  if (data.companyName) {
    doc.text(`Empresa: ${data.companyName}`);
  }

  if (data.inspectionTitle) {
    doc.text(`Vistoria: ${data.inspectionTitle}`);
  }

  doc.moveDown(0.5);

  // Responsible Technician
  doc.fontSize(11).font("Helvetica-Bold").text("RESPONSÁVEL TÉCNICO");
  doc.fontSize(10).font("Helvetica");
  doc.text(data.responsibleTechnician);

  doc.moveDown(1);

  // Description
  if (data.description) {
    doc.fontSize(11).font("Helvetica-Bold").text("DESCRIÇÃO");
    doc.fontSize(10).font("Helvetica");
    doc.text(data.description, { align: "justify" });
    doc.moveDown(1);
  }

  // Signature area
  doc.fontSize(11).font("Helvetica-Bold").text("ASSINATURA DIGITAL");
  doc.fontSize(10).font("Helvetica");

  if (data.digitalSignature) {
    doc.text("✓ Assinado digitalmente");
    doc.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`);
  } else {
    doc.moveDown(2);
    doc.text("_________________________________");
    doc.text("Assinatura do Responsável Técnico");
  }

  doc.moveDown(2);

  // Footer
  doc.fontSize(8).font("Helvetica").text(
    "Este documento foi gerado automaticamente pelo sistema de Gestão de Obras.",
    { align: "center" }
  );

  doc.end();

  return doc as any;
}
