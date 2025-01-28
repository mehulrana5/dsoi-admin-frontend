"use client"
import { UserContext } from "@/context/UserContextProvider"
import { useContext, useEffect, useState } from "react"
import {
    ColumnDef,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
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

function AdminsPage() {
    const context = useContext(UserContext)
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

    function handleUpdate(id: string) {
        console.log(`update ${id}`)
    }

    function handleDelete(id: string) {
        console.log(`delete ${id}`)
    }

    useEffect(() => {
        if (!context?.adminsData.length) {
            context?.getAdmins("", "")
        }
    }, [context])

    useEffect(() => {
        const handleResize = () => {
            setColumnVisibility({
                type: true,
                userName: true,
                lastActive: window.innerWidth > 768,
                createdAt: window.innerWidth > 768,
                actions: window.innerWidth > 768,
            })
        }

        window.addEventListener("resize", handleResize)
        handleResize()

        return () => window.removeEventListener("resize", handleResize)
    }, [])

    const data: Payment[] = context?.adminsData ?? []

    type Payment = {
        _id: string
        userName: string
        type: "superAdmin" | "analyst" | "bookKeeper" | "customerService" | "barTender"
        lastActive: Date | null
        createdAt: Date | null
    }

    const columns: ColumnDef<Payment>[] = [
        {
            accessorKey: "type",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    User Type
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="lowercase">{row.getValue("type")}</div>,
        },
        {
            accessorKey: "userName",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    User Name
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="lowercase">{row.getValue("userName")}</div>,
        },
        {
            accessorKey: "lastActive",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Last Active
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => (
                <div>{row.getValue("lastActive") ? new Date(row.getValue("lastActive")).toLocaleString() : "N/A"}</div>
            ),
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Created At
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => (
                <div>{row.getValue("createdAt") ? new Date(row.getValue("createdAt")).toLocaleDateString() : "N/A"}</div>
            ),
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const payment = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleUpdate(payment._id)}>Update</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(payment._id)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    function DataTable() {
        const [sorting, setSorting] = useState<SortingState>([])
        const [rowSelection, setRowSelection] = useState({})

        const table = useReactTable({
            data,
            columns,
            onSortingChange: setSorting,
            getCoreRowModel: getCoreRowModel(),
            getPaginationRowModel: getPaginationRowModel(),
            getSortedRowModel: getSortedRowModel(),
            onColumnVisibilityChange: setColumnVisibility,
            onRowSelectionChange: setRowSelection,
            state: {
                sorting,
                columnVisibility,
                rowSelection,
            },
        })

        return (
            <div className="w-full">
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Filter user names..."
                        value={(table.getColumn("userName")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("userName")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
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
                                .map((column) => (
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
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id} className="text-center">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    ))}
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
                                            <TableCell key={cell.id} className="text-center">
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
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: "column",
            flexWrap: "wrap",
            padding: "1em",
            alignItems: "center",
            justifyContent: "center",
            maxWidth: "1300px",
            margin: "auto",
        }}>
            <h1>Admins Page</h1>
            <DataTable />
        </div>
    )
}

export default AdminsPage