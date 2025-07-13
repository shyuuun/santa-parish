import Image from "next/image";
import type { Announcement } from "@/src/utils/types";

interface PostViewerProps {
	post: Announcement;
}

export default function PostViewer({ post }: PostViewerProps) {
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<article className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
			{post.image_url && (
				<div className="relative w-full h-[400px]">
					<Image
						src={post.image_url}
						alt={post.title}
						fill
						className="object-cover"
						priority
					/>
				</div>
			)}

			<div className="p-8">
				<div className="flex flex-col space-y-4">
					<div className="flex items-center justify-between">
						<h1 className="text-3xl font-bold text-gray-900">
							{post.title}
						</h1>
						{post.tag && (
							<span className="px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm">
								{post.tag}
							</span>
						)}
					</div>

					<time className="text-sm text-gray-500">
						Posted on {formatDate(post.created_at)}
					</time>

					<div
						className="prose prose-lg max-w-none mt-8"
						dangerouslySetInnerHTML={{ __html: post.content }}
					/>
				</div>
			</div>
		</article>
	);
}
