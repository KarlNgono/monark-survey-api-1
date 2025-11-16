export function fillTemplate(emailContent, emailTemplate, variables = {}) {

    if (!emailContent) throw new Error("emailContent is required");
    if (!emailTemplate) throw new Error("emailTemplate is required");

    const finalVars = { ...(emailTemplate.variables || {}), ...variables };

    const applyReplacements = (str, vars) => {
        if (!str) return "";
        let result = str;
        for (const key in vars) {
            result = result.replace(new RegExp(`{{${key}}}`, "g"), vars[key] ?? "");
        }
        return result;
    };

    const stripHtmlFormatted = (html = "") => {
        if (!html) return "";

        html = html.replace(/<div[^>]*class="header"[^>]*>[\s\S]*?<\/div>/i, "");
        html = html.replace(/<div[^>]*class="footer"[^>]*>[\s\S]*?<\/div>/i, "");
        html = html.replace(/<(style|script)[^>]*>[\s\S]*?<\/\1>/gi, "");

        html = html
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<\/p>/gi, "\n\n")
            .replace(/<p[^>]*>/gi, "")
            .replace(/<\/?div[^>]*>/gi, "\n")
            .replace(/<\/?h[1-6][^>]*>/gi, "\n\n")
            .replace(/<strong[^>]*>/gi, "**")
            .replace(/<\/strong>/gi, "**")
            .replace(/<em[^>]*>/gi, "*")
            .replace(/<\/em>/gi, "*")
            .replace(/<u[^>]*>/gi, "_")
            .replace(/<\/u>/gi, "_")
            .replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, "$2 ($1)")
            .replace(/<[^>]+>/g, "")
            .replace(/\s{2,}/g, " ")
            .replace(/\n{3,}/g, "\n\n")
            .trim();

        return html;
    };

    let html = emailTemplate.content_html || "";
    const content = emailContent.content_html || emailContent.content_text || "";
    html = applyReplacements(html.replace(/{{content}}/g, content), finalVars);

    const subject = applyReplacements(emailContent.subject || "", finalVars);

    const text =
        emailContent.content_text && emailContent.content_text.trim() !== ""
            ? applyReplacements(emailContent.content_text, finalVars)
            : stripHtmlFormatted(html);

    return { subject, html, text };
}
