"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/shadcn/table";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/components/shadcn/breadcrumb";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/src/components/shadcn/pagination";

import Search from "../admins/components/Search";
import { useFetchData } from "../hooks/useFetchData";
import { useRef, useState } from "react";
import { Users } from "@/src/utils/types";
import Badge from "@/src/components/Badge";
import { debounce } from "@/src/utils/functions";
import { admin } from "@/src/utils/route";
import UserInfo from "./components/UserInfo";
import { toast } from "sonner";
import { deleteUser } from "../actions";
import DeleteUserDialog from "./components/DeleteUserDialog";
import { approveUser } from "./actions";

export default function UserPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, pagination, refresh } = useFetchData<Users>({
    table: "user_with_roles",
    page,
    limit: 5,
    searchQuery: searchQuery,
    searchColumn: ["email", "name"],
    where: [{ column: "is_deleted", operator: "eq", value: false }],
  });

  const debouncedSetSearchQuery = useRef(
    debounce((value: string) => setSearchQuery(value), 500)
  ).current;

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetSearchQuery(event.target.value);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.lastPage) {
      setPage(newPage);
    }
  };

  const handleDelete = async (userId: string) => {
    const result = await deleteUser(userId);

    if (result.type === "success") {
      refresh(); // 🔁 refetch after deleting user
      toast(`${result.msg}`, {
        duration: 3000,
        description: "User deleted successfully.",
      });
    } else {
      toast.error(`${result.msg}`, {
        duration: 3000,
        description: "Failed to delete user.",
      });
    }
  };

  const handleApprove = async (userId: string) => {
    const result = await approveUser(userId);

    if (result.type === "success") {
      refresh(); // 🔁 refetch after deleting user
      toast(`${result.msg}`, {
        duration: 3000,
        description: "User approved successfully.",
      });
    } else {
      toast.error(`${result.msg}`, {
        duration: 3000,
        description: "Failed to approve user.",
      });
    }
  };

  return (
    <>
      <h1 className="mb-4">Users</h1>
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={admin.home}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Users</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>All Users</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Search onChange={handleSearch} />

      <Table>
        <TableCaption>A list of registered users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Birthdate</TableHead>
            <TableHead>Account Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6}>Loading...</TableCell>
            </TableRow>
          ) : (
            data?.map((user: Users) => (
              <TableRow key={user.user_id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.gender}</TableCell>
                <TableCell>{user.birthdate}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.role === "unverified_user" ? "warning" : "success"
                    }
                  >
                    {user.role === "unverified_user"
                      ? "Unverified"
                      : "Verified"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <UserInfo user={user} onApprove={handleApprove} />
                  <DeleteUserDialog
                    onDelete={handleDelete}
                    userId={user.user_id!}
                    email={user.email!}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(pagination.page - 1)}
              aria-disabled={pagination.page === 1}
              className={
                pagination.page === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
          {Array.from({ length: pagination.lastPage }, (_, index) => (
            <PaginationItem key={index + 1}>
              <PaginationLink
                isActive={pagination.page === index + 1}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(pagination.page + 1)}
              aria-disabled={pagination.page === pagination.lastPage}
              className={
                pagination.page === pagination.lastPage
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
