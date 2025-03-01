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
import MemberForm from "./MemberForm"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import Fuse from "fuse.js";

export function MembersTable() {

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
    const [smc, setSmc] = React.useState<any>("")
    const [queryText, setQueryText] = React.useState<string>("");
    const [searchResults, setSearchResults] = React.useState<any>([]);
    const [data, setData] = React.useState<Member[]>([]);
    const [flag, setFlag] = React.useState(true)

    React.useEffect(() => {
        if (!context?.membersData.data.length) {
            context?.getMembers("", "", 0, 0)
        }
        setColumnVisibility({
            userName: true,
            actions: true,
            contact: true,
            wallet: (context?.screenSize ?? 0) > 768,
            pendingAmount: (context?.screenSize ?? 0) > 768,
            email: (context?.screenSize ?? 0) > 768,
            photo: false,
            _id: false,
            createdAt: false,
        })
    }, [])

    function handleUpdate(param: any) {
        setOpen(true)
        setSelectedMember(param)
    }

    function handleDelete(param: any) {
        setOpenDelete(true)
        setSelectedMember(param);
    }

    // let data: Member[] = context?.membersData.data ?? []

    type Member = {
        _id: string
        userName: string
        contact: number
        email: string
        wallet: number
        pendingAmount: number
        photo: string
        createdAt: string
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
            cell: ({ row }) => <div className="text-center">{row.getValue("userName")}</div>,
        },
        {
            accessorKey: "contact",
            header: "Contact",
            cell: ({ row }) => <div className="text-center">{row.getValue("contact")}</div>,
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => <div className="text-center">{row.getValue("email")}</div>,
        },
        {
            accessorKey: "pendingAmount",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Pending
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="text-center">{row.getValue("pendingAmount")}</div>,
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
            cell: ({ row }) => (
                <div className="text-center">
                    {new Date(row.getValue("createdAt") as string).toLocaleDateString("en-GB")}
                </div>
            ),
            sortingFn: (rowA, rowB, columnId) => {
                const dateA = new Date(rowA.getValue(columnId) as string).getTime();
                const dateB = new Date(rowB.getValue(columnId) as string).getTime();
                return dateA - dateB;
            }
        },
        {
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
            cell: ({ row }) => <div className="text-center lowercase">
                {parseFloat(row.getValue("wallet")).toFixed(2)}
            </div>,
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

    React.useEffect(() => {
        setData(context?.membersData.data ?? [])
    }, [])

    React.useEffect(() => {
        if (!queryText) {
            setSearchResults(context?.membersData.data);
            return;
        }
        const fuse = new Fuse(context?.membersData?.data ?? [], {
            keys: ["userName", "contact", "email"],
            threshold: 0.5,
        });
        setSearchResults(fuse.search(queryText).map((result) => result.item));
    }, [queryText, context])

    React.useEffect(() => {
        setData(searchResults)
    }, [searchResults])

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
                        <Button>Add</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Title</DialogTitle>
                            <DialogDescription>Description</DialogDescription>
                        </DialogHeader>
                        <MemberForm props={{}} />
                    </DialogContent>
                </Dialog>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>Activate</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Activation Form</DialogTitle>
                            <DialogDescription></DialogDescription>
                        </DialogHeader>
                        <Label>Contact No.</Label>
                        <Input
                            type="tel"
                            name="smc"
                            onChange={(e) => { setSmc(e.target.value) }}
                            value={smc}
                        />
                        <Button onClick={() => { context?.activateMember(smc); }}>
                            Submit
                        </Button>
                    </DialogContent>
                </Dialog>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>Deactivate</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Deactivation Form</DialogTitle>
                            <DialogDescription></DialogDescription>
                        </DialogHeader>
                        <Label>Contact No.</Label>
                        <Input
                            type="tel"
                            name="smc"
                            onChange={(e) => { setSmc(e.target.value) }}
                            value={smc}
                        />
                        <Button onClick={() => { context?.deActivateMember(smc); }}>
                            Submit
                        </Button>
                    </DialogContent>
                </Dialog>
                {
                    flag ?
                        <Button onClick={() => {
                            context?.getSuspendedMembers("", "", 0, 0).then((res) => setData(res.data))
                            setFlag(false)
                        }}>Suspended</Button>
                        :
                        <Button onClick={() => {
                            context?.getMembers("", "", 0, 0).then((res) => setData(res.data))
                            setFlag(true)
                        }}>Members</Button>
                }
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
                    <MemberForm props={selectedMember} />
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
                        <AlertDialogAction onClick={() => context?.deleteMember(selectedMember._id)}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
