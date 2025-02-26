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
import { ArrowUpDown, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
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

export type Orders = {
    _id: string,
    member_id: string,
    item_id: string,
    itemInfo: string,
    status: string,
    orderDate: string
}

export const columns: ColumnDef<Orders>[] = [
    {
        accessorKey: "member_id",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Members
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("member_id")}</div>,
    },
    {
        accessorKey: "itemInfo",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Items
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => {
            let data: string
            data = row.getValue("itemInfo");
            let formattedData = data.replace(/\|/g, " ");
            return (
                <div>{formattedData}</div>
            )
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Status
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("status")}</div>,
    },
    {
        accessorKey: "orderDate",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Order Date
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="text-center">
                {new Date(row.getValue("orderDate") as string).toLocaleDateString("en-GB")}
            </div>
        ),
        sortingFn: (rowA, rowB, columnId) => {
            const dateA = new Date(rowA.getValue(columnId) as string).getTime();
            const dateB = new Date(rowB.getValue(columnId) as string).getTime();
            return dateA - dateB;
        }
    },
]

export function OrdersTable() {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const context = React.useContext(UserContext)
    const limit = (context?.screenSize ?? 0) > 768 ? 8 : 2;
    const [totalPages, setTotalPages] = React.useState(0);
    const [curpage, setCurPage] = React.useState(0);

    React.useEffect(() => {
        if (!context?.ordersData.data.length) {
            context?.getOrders("", "", 0, limit)
        }
        setColumnVisibility({
            _id: (context?.screenSize ?? 0) > 768,
            member_id: (context?.screenSize ?? 0) > 768,
            item_id: (context?.screenSize ?? 0) > 768,
            itemInfo: true,
            status: true,
            orderDate: true,
        })
    }, [])

    React.useEffect(() => {
        const newCount = context?.ordersData?.count || 0;
        setTotalPages(Math.ceil(newCount / limit));
    }, [context?.ordersData]);

    let data: Orders[] = context?.ordersData.data ?? []

    data.forEach(e => {
        e.itemInfo = e.itemInfo.split("|")[0]
    });


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
            context?.getOrders("", "", (curpage + 1) * limit, limit);
        }
    }

    function handlePrev() {
        if (curpage > 0) {
            setCurPage(curpage - 1);
            context?.getOrders("", "", (curpage - 1) * limit, limit);
        }
    }

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter items..."
                    value={(table.getColumn("itemInfo")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("itemInfo")?.setFilterValue(event.target.value)
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
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button className="sm" variant="outline" onClick={handlePrev} disabled={curpage === 0}>Previous</Button>
                    <Button className="sm" variant="outline" onClick={handleNext} disabled={curpage >= totalPages - 1}>Next</Button>
                </div>
            </div>
        </div>
    )
}
