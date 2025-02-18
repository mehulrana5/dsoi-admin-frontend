"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { UserContext } from "@/context/UserContextProvider"
import MemberForm from "./MemberForm"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function MembersTable() {

    const context = React.useContext(UserContext)
    const limit = 2;
    const [totalPages, setTotalPages] = React.useState(0);
    const [curpage, setCurPage] = React.useState(0);
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    React.useEffect(() => {
        if (!context?.membersData.data.length) {
            context?.getMembers("", "", 0, limit)
        }
        setColumnVisibility({
            userName: true,
            rank: true,
            actions: true,
            photo: true,
            wallet: (context?.screenSize ?? 0) > 768,
            pendingAmount: (context?.screenSize ?? 0) > 768,
            contact: (context?.screenSize ?? 0) > 768,
            email: (context?.screenSize ?? 0) > 768,
            _id: false,
            createdAt: false,
            lastActive: false,
        })
    }, [])

    React.useEffect(() => {
        const newCount = context?.membersData?.count || 0;
        setTotalPages(Math.ceil(newCount / limit));
    }, [context?.membersData]);

    function handleUpdate(id: string) {
        console.log(`update ${id}`);
    }

    function handleDelete(id: string) {
        console.log(`delete ${id}`);
    }

    const data: Member[] = context?.membersData.data ?? []

    type Member = {
        _id: string
        userName: string
        contact: number
        email: string
        wallet: number
        pendingAmount: number
        photo: string
        createdAt: string
        lastActive: string
        rank: string
    }

    const columns: ColumnDef<Member>[] = [
        {
            id: "photo",
            cell: ({ row }) => {
                return (
                    <img src={row.original.photo} alt="User photo" className="w-[100px] h-[100px] rounded-full object-center sm:w-[150px] sm:h-[150px] sm:rounded-none" />
                )
            }
        },
        {
            accessorKey: "userName",
            header: "User Name",
            cell: ({ row }) => <div>{row.getValue("userName")}</div>,
        },
        {
            accessorKey: "contact",
            header: "Contact",
            cell: ({ row }) => <div>{row.getValue("contact")}</div>,
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => <div>{row.getValue("email")}</div>,
        },
        {
            accessorKey: "pendingAmount",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Pending Amount
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div>{row.getValue("pendingAmount")}</div>,
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Created At
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div>{new Date(row.getValue("createdAt") as string).toLocaleDateString()}</div>,
        },
        {
            accessorKey: "lastActive",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Last Active
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div>{new Date(row.getValue("lastActive") as string).toLocaleDateString()}</div>,
        },
        {
            accessorKey: "rank",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Rank
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue("rank")}</div>,
        }, {
            accessorKey: "wallet",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Wallet
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue("wallet")}</div>,
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleUpdate(row.original._id)}>Update</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(row.original._id)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    function handleNext() {
        if (curpage < totalPages - 1) {
            setCurPage(curpage + 1);
            context?.getMembers("", "", (curpage + 1) * limit, limit);
        }
    }

    function handlePrev() {
        if (curpage > 0) {
            setCurPage(curpage - 1);
            context?.getMembers("", "", (curpage - 1) * limit, limit);
        }
    }

    return (
        <div className="w-full">
            <div className="flex flex-wrap gap-2 items-center py-4">
                <Input
                    placeholder="Filter emails..."
                    value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("email")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>Add Member</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Title</DialogTitle>
                            <DialogDescription>Description</DialogDescription>
                        </DialogHeader>
                        <MemberForm />
                    </DialogContent>
                </Dialog>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    Page {curpage + 1} of {totalPages}
                </div>
                <div className="space-x-2">
                    <Button className="sm" variant="outline" onClick={handlePrev} disabled={curpage === 0}>Previous</Button>
                    <Button className="sm" variant="outline" onClick={handleNext} disabled={curpage >= totalPages - 1}>Next</Button>
                </div>
            </div>
        </div>
    )
}
