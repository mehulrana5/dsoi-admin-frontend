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
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserContext } from "@/context/UserContextProvider"

type Log = {
    _id: string;
    initiatorId: string;
    targetId: string;
    targetModel: string;
    action: string;
    timeStamp: string;
};

export function LogsTable() {
    const context = React.useContext(UserContext);
    const limit = 10;

    const [count, setCount] = React.useState(0);
    const [totalPages, setTotalPages] = React.useState(0);
    const [curpage, setCurPage] = React.useState(0);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
        _id: false,
        initiatorId: false,
        targetId: false,
        targetModel: true,
        action: true,
        timeStamp: true,
    });

    React.useEffect(() => {
        if (!context?.logData?.data?.length) {
            context?.getLogs("", "", 0, 10);
        }
    }, [context]);

    React.useEffect(() => {
        const newCount = context?.logData?.count || 0;
        setCount(newCount);
        setTotalPages(Math.ceil(newCount / limit));
    }, [context?.logData]);

    function handleNext() {
        if (curpage < totalPages - 1) {
            setCurPage(curpage + 1);
            context?.getLogs("", "", (curpage + 1) * limit, limit);
        }
    }

    function handlePrev() {
        if (curpage > 0) {
            setCurPage(curpage - 1);
            context?.getLogs("", "", (curpage - 1) * limit, limit);
        }
    }

    const data: Log[] = context?.logData?.data ?? [];

    const columns: ColumnDef<Log>[] = [
        { accessorKey: "_id", header: "ID", cell: ({ row }) => <div>{row.getValue("_id")}</div> },
        { accessorKey: "initiatorId", header: "Initiator ID", cell: ({ row }) => <div>{row.getValue("initiatorId")}</div> },
        { accessorKey: "targetId", header: "Target ID", cell: ({ row }) => <div>{row.getValue("targetId")}</div> },
        { accessorKey: "targetModel", header: "Target Model", cell: ({ row }) => <div>{row.getValue("targetModel")}</div> },
        { accessorKey: "action", header: "Action", cell: ({ row }) => <div>{row.getValue("action")}</div> },
        {
            accessorKey: "timeStamp",
            header: "Time Stamp",
            cell: ({ row }) => (
                <div>
                    {new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(row.getValue("timeStamp") as string))}{" "}
                    {new Date(row.getValue("timeStamp") as string).toLocaleTimeString("en-GB")}
                </div>
            ),
        },
    ];

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: { sorting, columnFilters, columnVisibility, rowSelection },
    });

    return (
        <div className="w-full">
            <div className="flex flex-wrap gap-2 items-center py-4">
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
                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
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
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center">
                                    No data available.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <span>Page {curpage + 1} of {totalPages}</span>
                <div className="space-x-2">
                    <Button onClick={handlePrev} disabled={curpage === 0}>Previous</Button>
                    <Button onClick={handleNext} disabled={curpage >= totalPages - 1}>Next</Button>
                </div>
            </div>
        </div>
    );
}
