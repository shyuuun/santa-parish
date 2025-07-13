import { createClient } from "@/src/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import PostViewer from "@/src/components/PostViewer";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/src/components/shadcn/breadcrumb";
import type { Metadata } from "next";

interface AnnouncementPageProps {
	params: Promise<{
		id: string;
	}>;
}

// Generate metadata for SEO
export async function generateMetadata({
	params,
}: AnnouncementPageProps): Promise<Metadata> {
	const { id } = await params;
	const supabase = await createClient();

	const { data: announcement } = await supabase
		.from("announcements")
		.select("*")
		.eq("id", id)
		.single();

	if (!announcement) {
		return {
			title: "Announcement Not Found",
			description: "The requested announcement could not be found.",
		};
	}

	// Extract plain text from HTML content for description
	const plainTextContent = announcement.content
		.replace(/<[^>]*>/g, "")
		.substring(0, 160)
		.trim();

	return {
		title: `${announcement.title} | Santa Lucia Parish Cooperative`,
		description:
			plainTextContent ||
			"Read the latest announcement from Santa Lucia Parish Multipurpose Cooperative.",
		openGraph: {
			title: announcement.title,
			description: plainTextContent,
			type: "article",
			publishedTime: announcement.created_at,
			images: announcement.image_url
				? [
						{
							url: announcement.image_url,
							alt: announcement.title,
						},
				  ]
				: [],
		},
		twitter: {
			card: "summary_large_image",
			title: announcement.title,
			description: plainTextContent,
			images: announcement.image_url ? [announcement.image_url] : [],
		},
	};
}

export default async function AnnouncementPage({
	params,
}: AnnouncementPageProps) {
	// Await the params
	const { id } = await params;

	// Create Supabase client
	const supabase = await createClient();

	// Fetch the announcement data
	const { data: announcement } = await supabase
		.from("announcements")
		.select("*")
		.eq("id", id)
		.single();

	if (!announcement) {
		notFound();
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Navigation */}

			{/* Header with Breadcrumbs */}
			<div className="bg-white shadow-sm border-b">
				<div className="max-w-4xl mx-auto px-6 py-6">
					{/* Breadcrumb Navigation */}
					<Breadcrumb className="mb-4">
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink href="/">Home</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbLink href="/announcements">
									Announcements
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage className="line-clamp-1">
									{announcement.title}
								</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>

					{/* Back Button */}
					<Link
						href="/announcements"
						className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors font-medium"
						aria-label="Go back to announcements list"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to Announcements
					</Link>
				</div>
			</div>

			{/* Structured Data for SEO */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "Article",
						headline: announcement.title,
						datePublished: announcement.created_at,
						dateModified:
							announcement.updated_at || announcement.created_at,
						author: {
							"@type": "Organization",
							name: "Santa Lucia Parish Multipurpose Cooperative",
						},
						publisher: {
							"@type": "Organization",
							name: "Santa Lucia Parish Multipurpose Cooperative",
						},
						mainEntityOfPage: {
							"@type": "WebPage",
							"@id":
								typeof window !== "undefined"
									? window.location.href
									: "",
						},
						image: announcement.image_url || "",
						articleBody: announcement.content.replace(
							/<[^>]*>/g,
							""
						),
					}),
				}}
			/>

			{/* Main Content */}
			<main className="max-w-4xl mx-auto px-6 py-8">
				{/* Article Header */}
				<header className="mb-8">
					<div className="flex flex-wrap items-center gap-4 mb-4">
						{announcement.tag && (
							<div className="flex items-center gap-1">
								<Tag
									className="w-4 h-4 text-blue-600"
									aria-hidden="true"
								/>
								<span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
									{announcement.tag}
								</span>
							</div>
						)}
						<div className="flex items-center gap-1 text-gray-600">
							<Calendar className="w-4 h-4" aria-hidden="true" />
							<time
								dateTime={announcement.created_at}
								className="text-sm"
							>
								{new Date(
									announcement.created_at
								).toLocaleDateString("en-US", {
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</time>
						</div>
					</div>
					<h1 className="text-4xl font-bold text-gray-900 leading-tight">
						{announcement.title}
					</h1>
				</header>

				{/* Article Content */}
				<PostViewer post={announcement} />

				{/* Navigation Footer */}
				<footer className="mt-12 pt-8 border-t border-gray-200">
					<div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
						<Link
							href="/announcements"
							className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors"
							aria-label="Go back to announcements list"
						>
							<ArrowLeft className="w-4 h-4" />
							All Announcements
						</Link>
						<div className="flex gap-3">
							<Link
								href="/"
								className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
							>
								Home
							</Link>
							<Link
								href="/login"
								className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
							>
								Member Login
							</Link>
						</div>
					</div>
				</footer>
			</main>
		</div>
	);
}
