"use client";
import { bnUnicode2ANSI } from "@codesigntheory/bnunicode2ansi";

export default function generateJSX(data?: {
    title?: string;
    titleFontSize?: number;
    subtitle?: string;
    subtitleFontSize?: number;
    ad?: string;
}) {
    console.log(data);
    return ` <div
                style={{
                    position: "relative",
                    display: "flex",
                    width: "2000px",
                    height: "2000px",
                    backgroundColor: "#f7f7f7",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <img
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            width: "2000px",
                            height: "1000px",
                        }}
                        src="/images/shalbonbarta/redbg.png"
                        alt="Background"
                        width={2000}
                        height={1000}
                    />
                <div
                    style={{
                        display: "flex",
                        width: "100%",
                        height: "180px",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "30px 50px",
                    }}
                >
                    <span>
                        <img
                            src="/images/shalbonbarta/logo.png"
                            alt="Shalbon Barta Logo"
                            width={400}
                            height={120}
                        />
                    </span>
                    <span style={{ fontSize: "60px", fontWeight: "bold" }}>
                        ${bnUnicode2ANSI(
                            new Date().toLocaleDateString("bn-BD", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })
                        )}
                    </span>
                </div>
                 <div
                        style={{
                            display: "flex",
                            position: "relative",
                            width: "1900px",
                            height: "1068.75px",
                            borderRadius: "20px",
                            overflow: "hidden",
                            background:
                                "linear-gradient(to top, rgba(255,255,255, 1), rgba(254, 254, 254, 1),  rgba(236, 28, 36, 0.5), rgba(236, 28, 36, 1))",
                            padding: "20px 25px",
                            flexShrink: 0,
                        }}
                    >
                        <img
                            style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: "20px",
                                objectPosition: "center",
                                overflow: "hidden",
                                objectFit: "cover",
                            }}
                            src="/images/shalbonbarta/test.jpg"
                            alt="Featured Image"
                            width={2000}
                            height={1000}
                        />
                    </div>
                
                    <div
                        style={{
                            width: "100%",
                            height: "${data?.ad ? 456.25 : 636.25}px",  
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                            padding: "50px",
                            overflow: "hidden",
                        }}
                    >
                        <h2
                            style={{
                                fontSize: "${data?.subtitleFontSize || 90}px",
                                fontWeight: "bold",
                                color: "#FEE6DC",
                                lineHeight: "1",
                            }}
                        >
                            ${bnUnicode2ANSI(data?.subtitle || "")}
                        </h2>
                        <h1
                            style={{
                                fontSize: "${data?.titleFontSize || 110}px",
                                fontWeight: "bold",
                                color: "white",
                                whiteSpace: "pre-ine",
                                wordBreak: "break-word",
                                lineHeight: "0.8",
                            }}
                        >
                            ${bnUnicode2ANSI(data?.title || "")}
                        </h1>
                </div>
                <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "0px", flexShrink: 0 }}>
                <img
                    src="/images/shalbonbarta/footer.png"
                    alt="Footer"
                    width={2000}
                    height={115}                />
                ${
                    data?.ad
                        ? `<img
                            src="${data.ad}"
                            alt="ad"
                            width={2000}
                            height={180}
                            style={{ marginTop: "auto" }}
                        />`
                        : ""
                }
                    </div>
            </div>`;
}
