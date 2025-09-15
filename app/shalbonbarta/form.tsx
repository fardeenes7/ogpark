"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { ImageIcon, Trash2 } from "lucide-react";
import { SatoriPreview } from "./satori-preview";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import generateJSX from "./_template";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";

const formSchema = z.object({
    title: z.string().optional(),
    subtitle: z.string().min(1, "Subtitle is required").optional(),
    titleFontSize: z.number(),
    subtitleFontSize: z.number(),
    ad: z.string().optional(),
});

export default function ImageGenerator() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "শালবন বার্তা",
            subtitle: "শালবন বার্তা",
            titleFontSize: 110,
            subtitleFontSize: 90,
            ad: undefined,
        },
    });

    const formValues = form.watch();
    const [jsxCode, setJsxCode] = useState<string>("");

    useEffect(() => {
        setJsxCode(generateJSX(formValues));
    }, [formValues]);

    async function submitForm(data: z.infer<typeof formSchema>) {
        setJsxCode(generateJSX(data));
    }

    return (
        <div className="min-h-screen bg-background flex flex-col py-10 px-4">
            <div className="mx-auto w-full max-w-6xl">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-foreground mb-2">
                        Shalbonbarta24
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Configuration Panel */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(submitForm)}>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <ImageIcon className="h-5 w-5" />
                                        Image Configuration
                                    </CardTitle>
                                    <CardDescription>
                                        Customize your image settings and
                                        content
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Enter title text"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="subtitle"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Subtitle</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter subtitle text"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="titleFontSize"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Title Font Size
                                                </FormLabel>
                                                <div className="flex items-center gap-2">
                                                    <FormControl>
                                                        <Slider
                                                            value={[
                                                                field.value,
                                                            ]}
                                                            onValueChange={([
                                                                value,
                                                            ]) =>
                                                                field.onChange(
                                                                    value
                                                                )
                                                            }
                                                            step={5}
                                                            min={50}
                                                            max={200}
                                                        />
                                                    </FormControl>
                                                    <span>{field.value}px</span>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="subtitleFontSize"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Subtitle Font Size
                                                </FormLabel>
                                                <div className="flex items-center gap-2">
                                                    <FormControl>
                                                        <Slider
                                                            value={[
                                                                field.value,
                                                            ]}
                                                            onValueChange={([
                                                                value,
                                                            ]) =>
                                                                field.onChange(
                                                                    value
                                                                )
                                                            }
                                                            step={5}
                                                            min={50}
                                                            max={200}
                                                        />
                                                    </FormControl>
                                                    <span>{field.value}px</span>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="ad"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Ad Image</FormLabel>
                                                <div className="flex gap-2 items-center">
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter subtitle text"
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) =>
                                                                e.target
                                                                    .files &&
                                                                field.onChange(
                                                                    URL.createObjectURL(
                                                                        e.target
                                                                            .files?.[0]
                                                                    )
                                                                )
                                                            }
                                                        />
                                                    </FormControl>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            field.onChange(
                                                                undefined
                                                            )
                                                        }
                                                    >
                                                        <Trash2 />
                                                        Remove Ad
                                                    </Button>
                                                </div>
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        size="lg"
                                    >
                                        {/* {isGenerating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <ImageIcon className="mr-2 h-4 w-4" />
                                        Generate Image
                                    </>
                                )} */}
                                        Generate Image
                                    </Button>
                                </CardContent>
                            </Card>
                        </form>
                    </Form>

                    {/* Preview Panel */}

                    <SatoriPreview jsxCode={jsxCode} />
                </div>
            </div>
        </div>
    );
}
