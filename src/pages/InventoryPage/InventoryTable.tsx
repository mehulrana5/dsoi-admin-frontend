"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    PaginationState,
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import MyForm from "./InventoryForm"
import Fuse from "fuse.js"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

export function InventoryTable() {
    const context = React.useContext(UserContext)

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0, // Start from the first page
        pageSize: (context?.screenSize ?? 0) > 768 ? 8 : 6   // Default rows per page
    });

    const [open, setOpen] = React.useState(false)
    const [openDelete, setOpenDelete] = React.useState(false)
    const [selectedMember, setSelectedMember] = React.useState<any>({})
    const [queryText, setQueryText] = React.useState<string>("");
    const [searchResults, setSearchResults] = React.useState<any>([]);
    const [data, setData] = React.useState<Item[]>([]);

    type Item = {
        _id: string,
        name: string,
        brand: string,
        type: string,
        qty: number,
        price: number
    }

    const columns: ColumnDef<Item>[] = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => (
                <div className="text-center capitalize">{row.getValue("name")}</div>
            ),
        },
        {
            accessorKey: "brand",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Brand
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="text-center lowercase">{row.getValue("brand")}</div>,
        },
        {
            accessorKey: "type",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Type
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="text-center lowercase">{row.getValue("type")}</div>,
        },
        {
            accessorKey: "qty",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Qty
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="text-center lowercase">{row.getValue("qty")}</div>,
        },
        {
            accessorKey: "price",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Price
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="text-center lowercase">{row.getValue("price")}</div>,
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
                            <DropdownMenuItem onClick={() => handleUpdate(row.original)}>Update</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(row.original)}>Delete</DropdownMenuItem>
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
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
        },
    })

    function handleUpdate(param: any) {
        setOpen(true)
        setSelectedMember(param)
    }

    function handleDelete(param: any) {
        setOpenDelete(true)
        setSelectedMember(param);
    }

    React.useEffect(() => {
        if (!context?.itemsData.data.length) {
            context?.getItems("", "", 0, 0)
        }
        setColumnVisibility({
            _id: false,
            name: true,
            brand: true,
            type: true,
            qty: (context?.screenSize ?? 0) > 768,
            price: (context?.screenSize ?? 0) > 768,
            wallet: (context?.screenSize ?? 0) > 768,
        })
    }, [])

    React.useEffect(() => {
        if (!queryText) {
            setSearchResults(context?.itemsData.data);
            return;
        }
        const fuse = new Fuse(context?.itemsData?.data ?? [], {
            keys: ["name", "brand", "type"],
            threshold: 0.4,
        });
        setSearchResults(fuse.search(queryText).map((result) => result.item));
    }, [queryText, context])

    React.useEffect(() => {
        setData(searchResults)
    }, [searchResults])

    return (
        <div className="w-full">
            <div className="flex flex-wrap gap-2 items-center py-4">
                <Input
                    placeholder="Filter name..."
                    value={queryText}
                    onChange={
                        (event) => { setQueryText(event.target.value) }
                    }
                    className="max-w-sm"
                />
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>Add Item</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Title</DialogTitle>
                            <DialogDescription>Description</DialogDescription>
                        </DialogHeader>
                        <MyForm props={{ selectedMember }} />
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
                                        <TableHead className="text-center" key={header.id}>
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
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
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
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Member</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <MyForm props={selectedMember} />
                </DialogContent>
            </Dialog>
            <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this account
                            and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => context?.deleteItem(selectedMember._id)}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div>
    )
}
