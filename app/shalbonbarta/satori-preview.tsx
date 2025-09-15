"use client";

import {
    useState,
    useEffect,
    ReactNode,
    useCallback,
    useTransition,
} from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Download, FileImage } from "lucide-react";
import { toast } from "sonner";
import satori from "satori";
// import Editor from "@monaco-editor/react"
import { LiveProvider, withLive } from "react-live";

const loadFonts = async () => {
    try {
        // Use Inter from a reliable CDN that serves proper WOFF fonts
        const interFont = await fetch(
            "https://fonts.bunny.net/inter/files/inter-latin-400-normal.woff"
        ).then((res) => res.arrayBuffer());

        const solaimanLipi = await fetch("/fonts/kalpurush-ANSI.ttf").then(
            (res) => res.arrayBuffer()
        );

        return [
            // {
            //     name: "Inter",
            //     data: interFont,
            //     weight: 400 as const,
            //     style: "normal" as const,
            // },
            {
                name: "SolaimanLipi",
                data: solaimanLipi,
                weight: 400 as const,
                style: "normal" as const,
            },
        ];
    } catch (error) {
        console.warn("Failed to load remote font, using fallback:", error);

        // Fallback: Create a minimal TTF font data for Satori
        // This is a very basic font that Satori can understand
        const fallbackFont = new Uint8Array([
            0x00, 0x01, 0x00, 0x00, 0x00, 0x0c, 0x00, 0x80, 0x00, 0x03, 0x00,
            0x20, 0x47, 0x44, 0x45, 0x46, 0x00, 0x16, 0x00, 0x14, 0x00, 0x00,
            0x01, 0x2c,
        ]).buffer;

        return [
            {
                name: "Arial",
                data: fallbackFont,
                weight: 400 as const,
                style: "normal" as const,
            },
        ];
    }
};

interface SatoriPreviewProps {
    jsxCode: string;
}

export function SatoriPreview({ jsxCode }: SatoriPreviewProps) {
    // const [jsxCode, setJsxCode] = useState(defaultJsxCode);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const downloadImage = () => {
        if (!imageUrl) return;

        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = "satori-image.svg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("SVG image downloaded!");
    };

    const downloadAsPng = async () => {
        if (!imageUrl) return;

        try {
            // Create a canvas element
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                toast.error("Failed to create canvas context");
                return;
            }

            // Set canvas dimensions (1200x630 as per Satori config)
            canvas.width = 2000;
            canvas.height = 2000;

            // Create an image element
            const img = new Image();
            img.crossOrigin = "anonymous";

            img.onload = () => {
                // Draw the image on canvas
                ctx.drawImage(img, 0, 0, 2000, 2000);

                // Convert to PNG and download
                canvas.toBlob((blob) => {
                    if (blob) {
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = "satori-image.png";
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(url);
                        toast.success("PNG image downloaded!");
                    } else {
                        toast.error("Failed to generate PNG");
                    }
                }, "image/png");
            };

            img.onerror = () => {
                toast.error("Failed to load image for PNG conversion");
            };

            // Set the image source
            img.src = imageUrl;
        } catch (error) {
            console.error("PNG conversion error:", error);
            toast.error("Failed to convert to PNG");
        }
    };

    return (
        <Card className="space-y-3 sm:space-y-4">
            <CardHeader className="items-center">
                <CardTitle className="row-span-2">
                    Generated JSX & Preview
                </CardTitle>
                <CardAction>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={downloadImage}
                            className="justify-center sm:justify-start"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download SVG
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={downloadAsPng}
                            className="justify-center sm:justify-start"
                        >
                            <FileImage className="w-4 h-4 mr-2" />
                            Download PNG
                        </Button>
                    </div>
                </CardAction>
            </CardHeader>

            {/* <div className="bg-muted rounded-lg overflow-hidden">
                <Editor
                    height="300px"
                    defaultLanguage="jsx"
                    value={jsxCode}
                    onChange={(value) => setJsxCode(value ?? "")}
                    theme="vs-dark"
                    options={{
                        lineNumbers: "off",
                        readOnly: false,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 12,
                        wordWrap: "on",
                        folding: true,
                        lineDecorationsWidth: 10,
                        lineNumbersMinChars: 3,
                    }}
                />
            </div> */}
            <CardContent>
                <LiveProvider code={jsxCode}>
                    <LiveSatori setImageUrl={setImageUrl} imageUrl={imageUrl} />
                </LiveProvider>
            </CardContent>
        </Card>
    );
}

const LiveSatori = withLive(
    ({
        live,
        setImageUrl,
        imageUrl,
    }: {
        live?: { element: React.ComponentType; error: string };
        setImageUrl: (url: string) => void;
        imageUrl: string | null;
    }) => {
        const [error, setError] = useState<string | null>(null);
        const [isPending, startTransition] = useTransition();
        const element = live?.element?.prototype.render();

        const generatePreview = useCallback(
            async (element: ReactNode) => {
                setError(null);

                startTransition(async () => {
                    try {
                        // Load fonts first
                        const fonts = await loadFonts();
                        // await new Promise((resolve) =>
                        //     setTimeout(resolve, 500)
                        // );

                        const svg = await satori(element, {
                            width: 2000,
                            height: 2000,
                            fonts: fonts,
                        });

                        const blob = new Blob([svg], { type: "image/svg+xml" });
                        const url = URL.createObjectURL(blob);
                        startTransition(() => {
                            setImageUrl(url);
                        });
                    } catch (err) {
                        setError(
                            `Preview generation error: ${
                                err instanceof Error
                                    ? err.message
                                    : "Unknown error"
                            }`
                        );
                        console.error("Preview generation error:", err);
                    }
                });
            },
            [setImageUrl]
        );

        useEffect(() => {
            if (element) {
                generatePreview(element);
            }
        }, [element]);

        return (
            <>
                {isPending && (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                        <p className="text-sm text-muted-foreground">
                            Generating preview...
                        </p>
                    </div>
                )}
                {error && (
                    <div className="text-center text-red-500">
                        <p className="text-sm">{error}</p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => generatePreview(element)}
                            className="mt-2 bg-transparent"
                        >
                            Retry
                        </Button>
                    </div>
                )}
                {imageUrl && !isPending && !error && (
                    <img
                        src={imageUrl || "/placeholder.svg"}
                        alt="Satori Preview"
                        className="w-full max-w-full h-auto border rounded shadow-sm object-contain aspect-square"
                    />
                )}
            </>
        );
    }
);
