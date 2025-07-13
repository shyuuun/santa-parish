import Image from "next/image";
import { ImageIcon } from "lucide-react";
import type { Announcement } from "@/src/utils/types";

interface PostViewerProps {
	post: Announcement;
}

export default function PostViewer({ post }: PostViewerProps) {
	return (
		<article className="bg-white shadow-lg rounded-lg overflow-hidden">
			{/* Featured Image */}
			{post.image_url && (
				<div className="relative w-full h-[400px] overflow-hidden">
					<Image
						src={post.image_url}
						alt={`Featured image for ${post.title}`}
						fill
						className="object-cover transition-transform duration-300 hover:scale-105"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
						priority
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
				</div>
			)}

			{/* Content */}
			<div className="p-8">
				{/* Article Body */}
				<div
					className="prose prose-lg prose-gray max-w-none
						prose-headings:text-gray-900 prose-headings:font-bold
						prose-p:text-gray-700 prose-p:leading-relaxed
						prose-a:text-blue-600 prose-a:font-medium hover:prose-a:text-blue-700
						prose-strong:text-gray-900 prose-strong:font-semibold
						prose-ul:text-gray-700 prose-ol:text-gray-700
						prose-li:marker:text-blue-600
						prose-blockquote:border-l-4 prose-blockquote:border-blue-500 
						prose-blockquote:bg-blue-50 prose-blockquote:px-4 prose-blockquote:py-2
						prose-blockquote:text-blue-900 prose-blockquote:not-italic
						prose-code:bg-gray-100 prose-code:text-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
						prose-pre:bg-gray-900 prose-pre:text-gray-100
						prose-img:rounded-lg prose-img:shadow-md
						focus-within:outline-2 focus-within:outline-blue-500"
					dangerouslySetInnerHTML={{ __html: post.content }}
					role="main"
					aria-label="Announcement content"
				/>

				{/* Article Footer */}
				{!post.image_url && (
					<div className="mt-8 pt-6 border-t border-gray-200">
						<div className="flex items-center gap-2 text-sm text-gray-500">
							<ImageIcon className="w-4 h-4" aria-hidden="true" />
							<span>No featured image for this announcement</span>
						</div>
					</div>
				)}
			</div>
		</article>
	);
}
