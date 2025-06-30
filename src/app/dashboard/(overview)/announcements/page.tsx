"use client";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/src/components/shadcn/breadcrumb";

import { admin } from "@/src/utils/route";

import Editor from "react-simple-wysiwyg";
import AddAnnouncementDialog from "./components/AddAnnouncementDialog";

export default function Announcements() {
	return (
		<>
			<h1 className="mb-4">Announcements</h1>
			<Breadcrumb className="mb-4">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href={admin.announcements}>
							Home
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Announcements</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<div className="flex justify-end mb-4">
				<AddAnnouncementDialog />
			</div>
			
		</>
	);
}
