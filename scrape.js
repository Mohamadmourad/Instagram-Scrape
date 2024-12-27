const puppeteer = require('puppeteer');
require('dotenv').config();

const run = async (username) => {
    const browser = await puppeteer.launch({
        headless: true,
         args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36');

    const cookies = [
        {
            name: 'sessionid',
            value: process.env.SESSIONID,
            domain: 'www.instagram.com'
        }
    ];

    await page.setCookie(...cookies);

    await page.setRequestInterception(true);
    await page.setViewport({ width: 800, height: 600 });

    page.on('request', (request) => {
        const url = request.url();
        if (['stylesheet', 'font'].includes(request.resourceType())) {
            request.abort();
        } else if (url.endsWith('.jpg') || url.endsWith('.mp4')) {
            request.continue();
        } else {
            request.continue();
        }
    });

    await page.goto(`https://www.instagram.com/${username}/`, {
        waitUntil: 'networkidle2',
        timeout: 80000
    });

    const data = await page.evaluate(() => {
        try {
            const username = document.querySelector(".x1lliihq.x193iq5w.x6ikm8r.x10wlt62.xlyipyv.xuxw1ft")?.innerText || "N/A";

            const name = document.querySelector(".x1lliihq.x1plvlek.xryxfnj.x1n2onr6.x1ji0vk5.x18bv5gf.x193iq5w.xeuugli.x1fj9vlw.x13faqbe.x1vvkbs.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x1i0vuye.xvs91rp.x1s688f.x5n08af.x10wh9bi.x1wdrske.x8viiok.x18hxmgj")?.innerText || "N/A";

            const pfp = document.querySelector(".xpdipgo.x972fbf.xcfux6l.x1qhh985.xm0m39n.xk390pu.x5yr21d.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xl1xv1r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x11njtxf.xh8yej3")?.src || "N/A";

            const linkContainer = document.querySelector(".x3nfvp2.x193iq5w");
            const link = linkContainer?.querySelector("a")?.href || "N/A";
        
            const headerElements = document.querySelectorAll(
                ".html-span.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1hl2dhg.x16tdsg8.x1vvkbs"
            );
            const header = Array.from(headerElements).map(el => el.innerText || "N/A");

            const description = document.querySelector("span._ap3a")?.innerText || "N/A";

            const posts = Array.from(document.querySelectorAll(".x1lliihq.x1n2onr6.xh8yej3.x4gyw5p.x1ntc13c.x9i3mqj.x11i5rnm.x2pgyrj")).map(post => {
                const link = post.querySelector('a')?.href || "N/A"; 
                const img = post.querySelector('img')?.src || "N/A";
                const type = link.includes("reel") ? "reel" : "post";
                return { type, link, img };
            });

            return {
                username,
                name,
                pfp,
                link,
                numberOfPosts: header[0] || "N/A",
                followers: header[1] || "N/A",
                following: header[2] || "N/A",
                description,
                posts
            };
        } catch (err) {
            console.error("Error in evaluate:", err);
            return null;
        }
    });

    if (data) {
        console.log("Scraped Data: ", data);
        return data ;
    } else {
        console.log("Failed to scrape the data.");
    }

    await browser.close();
};


module.exports = { run };
