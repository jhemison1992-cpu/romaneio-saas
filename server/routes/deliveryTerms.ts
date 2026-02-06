import { Router, Request, Response } from "express";
import { getDeliveryTermById, getInspectionById, getCompanyById } from "../db-features";
import { generateDeliveryTermPDF } from "../pdf-generator";
import { getDb } from "../db";
import { deliveryTerms } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { storagePut } from "../storage";

const router = Router();

/**
 * GET /api/deliveryTerms/:id/pdf
 * Download PDF for a delivery term
 */
router.get("/:id/pdf", async (req: Request, res: Response) => {
  try {
    const termId = parseInt(req.params.id);

    if (isNaN(termId)) {
      return res.status(400).json({ error: "Invalid term ID" });
    }

    const term = await getDeliveryTermById(termId);

    if (!term) {
      return res.status(404).json({ error: "Delivery term not found" });
    }

    // Get inspection details
    const inspection = await getInspectionById(term.inspectionId);
    if (!inspection) {
      return res.status(404).json({ error: "Inspection not found" });
    }

    // Get company details if available
    let companyName = "";
    if (term.companyId) {
      const company = await getCompanyById(term.companyId);
      if (company) {
        companyName = company.name;
      }
    }

    // Generate PDF
    const pdfBuffer = await generateDeliveryTermPDF({
      ...term,
      inspectionTitle: inspection.title,
      companyName,
    });

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="termo-entrega-${term.protocolNumber}.pdf"`
    );
    res.setHeader("Content-Length", pdfBuffer.length);

    // Send PDF
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});

/**
 * POST /api/deliveryTerms/:id/upload-pdf
 * Upload generated PDF to S3 and save URL
 */
router.post("/:id/upload-pdf", async (req: Request, res: Response) => {
  try {
    const termId = parseInt(req.params.id);

    if (isNaN(termId)) {
      return res.status(400).json({ error: "Invalid term ID" });
    }

    const term = await getDeliveryTermById(termId);

    if (!term) {
      return res.status(404).json({ error: "Delivery term not found" });
    }

    // Get inspection details
    const inspection = await getInspectionById(term.inspectionId);
    if (!inspection) {
      return res.status(404).json({ error: "Inspection not found" });
    }

    // Get company details if available
    let companyName = "";
    if (term.companyId) {
      const company = await getCompanyById(term.companyId);
      if (company) {
        companyName = company.name;
      }
    }

    // Generate PDF
    const pdfBuffer = await generateDeliveryTermPDF({
      ...term,
      inspectionTitle: inspection.title,
      companyName,
    });

    // Upload to S3
    const fileKey = `delivery-terms/${term.userId}/${term.protocolNumber}.pdf`;
    const { url } = await storagePut(fileKey, pdfBuffer, "application/pdf");

    // Update delivery term with PDF URL
    const db = await getDb();
    if (db) {
      await db
        .update(deliveryTerms)
        .set({ pdfUrl: url })
        .where(eq(deliveryTerms.id, termId));
    }

    res.json({ url, fileKey });
  } catch (error) {
    console.error("Error uploading PDF:", error);
    res.status(500).json({ error: "Failed to upload PDF" });
  }
});

export default router;
