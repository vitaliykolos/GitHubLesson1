/**
 * Domain Russian Roots Checker
 *
 * Checks whether a domain's brand name has Russian origins based on:
 * 1. A curated database of known Russian-origin companies and brands
 * 2. Russian-associated TLDs (.ru, .su, .рф, etc.)
 * 3. Linguistic patterns common in Russian brand names
 */

// ─── Known Russian-origin brands database ────────────────────────────────────
// Each entry: keyword matched against the extracted brand name
// Fields: name, category, description, confidence (high/medium)

const RUSSIAN_BRANDS = [
    // ── Major tech companies ──
    { keyword: "yandex", name: "Yandex", category: "Technology", description: "Russian multinational tech company, largest search engine in Russia. Founded by Arkady Volozh in Moscow in 1997.", confidence: "high" },
    { keyword: "kaspersky", name: "Kaspersky Lab", category: "Cybersecurity", description: "Global cybersecurity company founded in Moscow in 1997 by Eugene Kaspersky.", confidence: "high" },
    { keyword: "vk", name: "VKontakte (VK)", category: "Social Media", description: "Russia's largest social network, founded by Pavel Durov in Saint Petersburg in 2006.", confidence: "high" },
    { keyword: "vkontakte", name: "VKontakte", category: "Social Media", description: "Russia's largest social network, founded by Pavel Durov in Saint Petersburg in 2006.", confidence: "high" },
    { keyword: "mail", name: "Mail.ru Group (VK)", category: "Technology", description: "Russian internet company operating email, social networks, and gaming. Now part of VK.", confidence: "medium" },
    { keyword: "telegram", name: "Telegram", category: "Messaging", description: "Messaging platform founded by Russian-born Pavel Durov. Originally developed in Russia, now based in Dubai.", confidence: "medium" },
    { keyword: "nginx", name: "NGINX", category: "Web Server Software", description: "Web server software created by Igor Sysoev in Moscow in 2004. Later acquired by F5 Networks.", confidence: "high" },
    { keyword: "jetbrains", name: "JetBrains", category: "Software Development", description: "Software company founded in Prague by three Russian developers (Sergey Dmitriev, Valentin Kipyatkov, Eugene Belyaev) in 2000.", confidence: "high" },
    { keyword: "parallels", name: "Parallels", category: "Virtualization", description: "Software company founded by Russian-born Serguei Beloussov. Known for virtualization products.", confidence: "high" },
    { keyword: "acronis", name: "Acronis", category: "Data Protection", description: "Cyber-protection company co-founded by Russian-born Serguei Beloussov in Singapore.", confidence: "high" },
    { keyword: "abbyy", name: "ABBYY", category: "AI / OCR", description: "AI and OCR technology company founded in Moscow in 1989 by David Yang.", confidence: "high" },
    { keyword: "drweb", name: "Dr.Web", category: "Cybersecurity", description: "Russian antivirus company founded in 1992 by Igor Danilov.", confidence: "high" },
    { keyword: "positive", name: "Positive Technologies", category: "Cybersecurity", description: "Russian cybersecurity company headquartered in Moscow.", confidence: "medium" },
    { keyword: "1c", name: "1C Company", category: "Enterprise Software", description: "Russian software company best known for 1C:Enterprise business platform. Founded in Moscow in 1991.", confidence: "high" },

    // ── E-commerce and services ──
    { keyword: "ozon", name: "Ozon", category: "E-commerce", description: "One of Russia's largest e-commerce platforms, founded in 1998 in Moscow.", confidence: "high" },
    { keyword: "wildberries", name: "Wildberries", category: "E-commerce", description: "Russia's largest online retailer, founded in 2004 by Tatyana Bakalchuk.", confidence: "high" },
    { keyword: "lamoda", name: "Lamoda", category: "E-commerce / Fashion", description: "Russian online fashion retailer founded in 2011, headquartered in Moscow.", confidence: "high" },
    { keyword: "avito", name: "Avito", category: "Classifieds", description: "Russian classified advertisements platform, one of the most visited websites in Russia.", confidence: "high" },
    { keyword: "cian", name: "Cian", category: "Real Estate", description: "Russian online real estate platform headquartered in Moscow.", confidence: "high" },
    { keyword: "2gis", name: "2GIS", category: "Maps / Navigation", description: "Russian map and business directory service founded in Novosibirsk.", confidence: "high" },
    { keyword: "drom", name: "Drom.ru", category: "Auto Classifieds", description: "Russian automotive classifieds platform.", confidence: "high" },

    // ── Banking and fintech ──
    { keyword: "sberbank", name: "Sberbank", category: "Banking", description: "Russia's largest bank, state-controlled, headquartered in Moscow.", confidence: "high" },
    { keyword: "sber", name: "Sber", category: "Banking / Tech", description: "Sberbank's technology ecosystem brand (SberCloud, SberDevices, etc.).", confidence: "high" },
    { keyword: "tinkoff", name: "Tinkoff (T-Bank)", category: "Banking / Fintech", description: "Russian online bank founded by Oleg Tinkov in 2006.", confidence: "high" },
    { keyword: "alfabank", name: "Alfa-Bank", category: "Banking", description: "One of Russia's largest private banks, part of Alfa Group.", confidence: "high" },
    { keyword: "alfagroup", name: "Alfa Group", category: "Conglomerate", description: "Russian conglomerate founded by Mikhail Fridman.", confidence: "high" },
    { keyword: "vtb", name: "VTB Bank", category: "Banking", description: "Russian state-owned bank headquartered in Moscow.", confidence: "high" },
    { keyword: "qiwi", name: "QIWI", category: "Fintech / Payments", description: "Russian payment service provider founded in 2007.", confidence: "high" },

    // ── Media and entertainment ──
    { keyword: "rt", name: "RT (Russia Today)", category: "Media", description: "Russian state-funded international news network.", confidence: "medium" },
    { keyword: "ria", name: "RIA Novosti", category: "Media", description: "Russian state news agency.", confidence: "medium" },
    { keyword: "tass", name: "TASS", category: "Media", description: "Russian state news agency, one of the largest in the world.", confidence: "high" },
    { keyword: "lenta", name: "Lenta.ru", category: "Media", description: "Russian online newspaper and news aggregator.", confidence: "high" },
    { keyword: "rambler", name: "Rambler", category: "Internet / Media", description: "Russian internet portal and search engine.", confidence: "high" },
    { keyword: "ivi", name: "ivi", category: "Streaming", description: "Russian video streaming service, one of the largest in Russia.", confidence: "high" },
    { keyword: "okko", name: "Okko", category: "Streaming", description: "Russian streaming service owned by Sber.", confidence: "high" },
    { keyword: "kinopoisk", name: "Kinopoisk", category: "Movies / Streaming", description: "Russian film database and streaming service, owned by Yandex.", confidence: "high" },

    // ── Gaming ──
    { keyword: "gaijin", name: "Gaijin Entertainment", category: "Gaming", description: "Russian video game developer known for War Thunder. Founded in Moscow in 2002.", confidence: "high" },
    { keyword: "mundfish", name: "Mundfish", category: "Gaming", description: "Russian game studio, developer of Atomic Heart.", confidence: "high" },
    { keyword: "owlcat", name: "Owlcat Games", category: "Gaming", description: "Russian game studio known for Pathfinder RPG series. Founded in Moscow.", confidence: "high" },
    { keyword: "targetem", name: "Targetem (4A Games origin)", category: "Gaming", description: "Ukrainian-Russian development roots in the Metro game series.", confidence: "medium" },
    { keyword: "lesta", name: "Lesta Studio", category: "Gaming", description: "Russian game studio, manages World of Warships and World of Tanks in Russia.", confidence: "high" },

    // ── Telecom ──
    { keyword: "megafon", name: "MegaFon", category: "Telecom", description: "One of Russia's largest mobile operators.", confidence: "high" },
    { keyword: "mts", name: "MTS (Mobile TeleSystems)", category: "Telecom", description: "Russia's largest mobile network operator.", confidence: "high" },
    { keyword: "beeline", name: "Beeline (VEON)", category: "Telecom", description: "Major Russian mobile operator brand, owned by VEON.", confidence: "high" },
    { keyword: "rostelecom", name: "Rostelecom", category: "Telecom", description: "Russia's largest digital services and telecom provider, state-controlled.", confidence: "high" },
    { keyword: "yota", name: "Yota", category: "Telecom", description: "Russian telecom operator, subsidiary of MegaFon.", confidence: "high" },

    // ── Energy and industry ──
    { keyword: "gazprom", name: "Gazprom", category: "Energy", description: "Russian state-majority-owned energy corporation, world's largest natural gas company.", confidence: "high" },
    { keyword: "lukoil", name: "Lukoil", category: "Energy", description: "Russia's second largest oil company, headquartered in Moscow.", confidence: "high" },
    { keyword: "rosneft", name: "Rosneft", category: "Energy", description: "Russian state-controlled oil company, one of the world's largest publicly traded petroleum companies.", confidence: "high" },
    { keyword: "novatek", name: "Novatek", category: "Energy", description: "Russia's largest independent natural gas producer.", confidence: "high" },
    { keyword: "nornickel", name: "Nornickel", category: "Mining", description: "Russian nickel and palladium mining company, world's largest producer of palladium.", confidence: "high" },
    { keyword: "rusal", name: "Rusal", category: "Mining", description: "Russian aluminium company, one of the world's largest aluminium producers.", confidence: "high" },
    { keyword: "severstal", name: "Severstal", category: "Steel", description: "Russian steel and mining company headquartered in Cherepovets.", confidence: "high" },

    // ── Transport and logistics ──
    { keyword: "aeroflot", name: "Aeroflot", category: "Airline", description: "Russia's flag carrier airline, based in Moscow.", confidence: "high" },
    { keyword: "s7", name: "S7 Airlines", category: "Airline", description: "Russia's largest private airline, based in Novosibirsk.", confidence: "high" },
    { keyword: "utair", name: "UTair", category: "Airline", description: "Russian airline headquartered in Khanty-Mansiysk.", confidence: "high" },
    { keyword: "rzd", name: "Russian Railways (RZD)", category: "Transport", description: "Russian state railway company, one of the world's largest railway companies.", confidence: "high" },

    // ── Other tech / startups ──
    { keyword: "badoo", name: "Badoo", category: "Dating", description: "Dating app founded by Russian entrepreneur Andrey Andreev (London-based).", confidence: "high" },
    { keyword: "bumble", name: "Bumble", category: "Dating", description: "Dating app co-founded by Russian-born Andrey Andreev through Badoo's Magic Lab.", confidence: "medium" },
    { keyword: "miro", name: "Miro", category: "Collaboration", description: "Online collaborative whiteboard platform, originally RealtimeBoard, founded in Perm, Russia.", confidence: "high" },
    { keyword: "clickhouse", name: "ClickHouse", category: "Database", description: "Open-source column-oriented DBMS originally developed at Yandex in Russia.", confidence: "high" },
    { keyword: "veeam", name: "Veeam", category: "Data Backup", description: "Data backup company co-founded by Russian entrepreneurs Ratmir Timashev and Andrei Baronov.", confidence: "high" },
    { keyword: "devexperts", name: "Devexperts", category: "Fintech Software", description: "Software company with Russian roots, specializing in financial technology.", confidence: "high" },
    { keyword: "luxoft", name: "Luxoft", category: "IT Services", description: "IT services company founded in Moscow in 2000 by Anatoly Karachinsky.", confidence: "high" },
    { keyword: "dataart", name: "DataArt", category: "IT Services", description: "Software engineering firm co-founded by Russian-born Eugene Goland.", confidence: "high" },
    { keyword: "gridgain", name: "GridGain", category: "Database / Computing", description: "In-memory computing company founded by Russian-born Nikita Ivanov.", confidence: "high" },
    { keyword: "semrush", name: "Semrush", category: "Digital Marketing", description: "SaaS company for SEO and marketing, founded by Russian entrepreneurs Oleg Shchegolev and Dmitry Melnikov.", confidence: "high" },
    { keyword: "bitrix", name: "Bitrix24", category: "Business Software", description: "Collaboration and CRM platform by 1C-Bitrix, a Russian company.", confidence: "high" },
    { keyword: "elama", name: "eLama", category: "Ad Tech", description: "Russian advertising management platform.", confidence: "high" },
    { keyword: "selectel", name: "Selectel", category: "Cloud / Hosting", description: "Russian cloud infrastructure provider based in Saint Petersburg.", confidence: "high" },
    { keyword: "reg", name: "REG.RU", category: "Domain Registrar", description: "One of the largest domain registrars in Russia.", confidence: "medium" },
    { keyword: "nic", name: "RU-CENTER (NIC)", category: "Domain Registrar", description: "Major Russian domain registrar.", confidence: "medium" },
];

// ─── Russian-associated TLDs ─────────────────────────────────────────────────

const RUSSIAN_TLDS = {
    ".ru":      "Russia's primary country-code TLD",
    ".su":      "Soviet Union legacy TLD, still actively used in Russia",
    ".рф":      "Russia's internationalized (Cyrillic) country-code TLD",
    ".москва":  "TLD for Moscow",
    ".moscow":  "TLD for Moscow (Latin script)",
    ".tatar":   "TLD for Tatarstan, Russia",
};

// ─── Russian linguistic patterns ─────────────────────────────────────────────

const RUSSIAN_PATTERNS = [
    { pattern: /^(sber|ber)/, label: "Sber- prefix (common Russian banking/tech pattern)", weight: 0.4 },
    { pattern: /(tech|soft|lab|dev|group|bank|invest|stroy|prom|neft|gaz|trans|avia|tele|seti|svyaz)$/i, label: "Common Russian corporate suffix", weight: 0.1 },
    { pattern: /^(ros|russ?|msk|spb|novo|kras|sam|ural|sib|baikal|volga|kazan)/i, label: "Russian geographic / national prefix", weight: 0.5 },
    { pattern: /(shtein|ovich|enko|yrev|arov|anov|yanov|insk|ovsk|etsk|itsk)/i, label: "Russian/Slavic morphological pattern", weight: 0.4 },
    { pattern: /^(pravda|izvestia|gazeta|novosti|vedomosti|kommersant)/i, label: "Russian media brand name", weight: 0.7 },
    { pattern: /(sputnik|mir|soyuz|kosmos|pobeda|druzhba|molot)/i, label: "Iconic Russian/Soviet word", weight: 0.5 },
];

// ─── Helper: extract brand name from domain ──────────────────────────────────

function extractBrand(domain) {
    // Remove protocol if present
    domain = domain.replace(/^https?:\/\//, "");
    // Remove path
    domain = domain.split("/")[0];
    // Remove port
    domain = domain.split(":")[0];
    // Lowercase
    domain = domain.toLowerCase().trim();

    const parts = domain.split(".");
    // Remove known TLD parts from the end to get the brand portion
    // For domains like "mail.ru" -> brand is "mail"
    // For "www.kaspersky.com" -> brand is "kaspersky"
    // Filter out "www"
    const filtered = parts.filter(p => p !== "www");

    // The brand is typically the second-level domain
    // e.g. kaspersky.com -> kaspersky, news.yandex.ru -> yandex
    let tld = "";
    let brand = "";

    if (filtered.length >= 2) {
        tld = "." + filtered[filtered.length - 1];
        brand = filtered[filtered.length - 2];
    } else if (filtered.length === 1) {
        brand = filtered[0];
    }

    return { brand, tld, fullDomain: domain };
}

// ─── Main analysis function ──────────────────────────────────────────────────

function analyzeDomain(input) {
    const { brand, tld, fullDomain } = extractBrand(input);

    if (!brand) {
        return { error: "Could not extract a brand name from the input." };
    }

    const signals = [];
    let russianScore = 0;

    // 1) Check known brands database
    const dbMatch = RUSSIAN_BRANDS.find(entry =>
        brand === entry.keyword || brand.includes(entry.keyword) || entry.keyword.includes(brand)
    );

    if (dbMatch) {
        const weight = dbMatch.confidence === "high" ? 0.8 : 0.5;
        russianScore += weight;
        signals.push({
            type: "database",
            tag: "match",
            label: `Known brand: ${dbMatch.name}`,
            detail: dbMatch.description,
            category: dbMatch.category,
            confidence: dbMatch.confidence,
        });
    }

    // 2) Check TLD
    const tldInfo = RUSSIAN_TLDS[tld];
    if (tldInfo) {
        russianScore += 0.3;
        signals.push({
            type: "tld",
            tag: "tld",
            label: `Russian TLD: ${tld}`,
            detail: tldInfo,
        });
    }

    // 3) Linguistic patterns
    for (const pat of RUSSIAN_PATTERNS) {
        if (pat.pattern.test(brand)) {
            russianScore += pat.weight;
            signals.push({
                type: "pattern",
                tag: "match",
                label: pat.label,
                detail: `Brand "${brand}" matches pattern: ${pat.pattern}`,
            });
        }
    }

    // Clamp score to 0-1
    russianScore = Math.min(1, Math.max(0, russianScore));

    // Determine verdict
    let verdict, verdictClass;
    if (russianScore >= 0.5) {
        verdict = "Likely has Russian roots";
        verdictClass = "russian";
    } else if (russianScore >= 0.2) {
        verdict = "Possibly has Russian connections";
        verdictClass = "uncertain";
    } else {
        verdict = "No Russian roots detected";
        verdictClass = "not-russian";
    }

    return {
        brand,
        tld,
        fullDomain,
        verdict,
        verdictClass,
        score: russianScore,
        signals,
        dbMatch,
    };
}

// ─── UI rendering ────────────────────────────────────────────────────────────

function checkDomain() {
    const input = document.getElementById("domainInput").value.trim();
    if (!input) return;

    const result = analyzeDomain(input);
    const card = document.getElementById("resultCard");

    if (result.error) {
        card.innerHTML = `<p style="color:#f87171;">${result.error}</p>`;
        card.classList.add("visible");
        return;
    }

    const iconMap = {
        russian: "\u{1F1F7}\u{1F1FA}",
        "not-russian": "\u2705",
        uncertain: "\u{1F914}",
    };

    const scorePercent = Math.round(result.score * 100);

    let signalTags = "";
    for (const s of result.signals) {
        signalTags += `<span class="tag ${s.tag}">${s.label}</span> `;
    }

    let explanationHTML = "";
    if (result.signals.length > 0) {
        explanationHTML = `<div class="explanation"><strong>Analysis details:</strong><br><ul style="margin-top:8px;padding-left:18px;">`;
        for (const s of result.signals) {
            explanationHTML += `<li style="margin-bottom:6px;">${s.detail}</li>`;
        }
        explanationHTML += `</ul></div>`;
    } else {
        explanationHTML = `<div class="explanation">No signals of Russian origin were found for the brand "<strong>${result.brand}</strong>". The domain does not match any known Russian brands, Russian TLDs, or Russian linguistic patterns in our database.</div>`;
    }

    card.innerHTML = `
        <div class="result-header">
            <div class="result-icon ${result.verdictClass}">${iconMap[result.verdictClass]}</div>
            <div>
                <div class="result-title ${result.verdictClass}">${result.verdict}</div>
                <div class="result-domain">${result.fullDomain}</div>
            </div>
        </div>

        <div class="result-details">
            <div class="detail-row">
                <span class="detail-label">Brand name</span>
                <span class="detail-value">${result.brand}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">TLD</span>
                <span class="detail-value">${result.tld || 'N/A'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Confidence score</span>
                <span class="detail-value">${scorePercent}%</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Signals detected</span>
                <span class="detail-value">${result.signals.length}</span>
            </div>
            ${result.dbMatch ? `
            <div class="detail-row">
                <span class="detail-label">Category</span>
                <span class="detail-value">${result.dbMatch.category}</span>
            </div>` : ''}
        </div>

        <div style="margin-top:14px;">${signalTags}</div>

        ${explanationHTML}
    `;

    card.classList.add("visible");
}

function fillExample(domain) {
    document.getElementById("domainInput").value = domain;
    checkDomain();
}

// Allow Enter key to trigger check
document.getElementById("domainInput").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        checkDomain();
    }
});
