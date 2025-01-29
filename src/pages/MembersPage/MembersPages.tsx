import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserContext } from "@/context/UserContextProvider"
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import { useContext, useEffect, useState } from "react"
import MemberForm from "./MemberForm"

function MembersPages() {

  const context = useContext(UserContext)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [selectedRow, setSelectedRow] = useState<any>(-1)

  useEffect(() => {
    if (!context?.membersData.length) {
      context?.getMembers("", "")
    }
    const handleResize = () => {
      setColumnVisibility({
        userName: true,
        rank: true,
        actions: true,
        photo: true,
        wallet: (context?.screenSize ?? 0) > 768,
        pendingDate: (context?.screenSize ?? 0) > 768,
        contact: (context?.screenSize ?? 0) > 768,
        _id: false,
        email: false,
        createdAt: false,
        lastActive: false,
      })
    }
    window.addEventListener("resize", handleResize)
    handleResize()
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  function handleMember(idx: number) {
    console.log(context?.membersData[idx]);
    setSelectedRow(idx)
  }

  function handleUpdate(id: string) {
    console.log(`update ${id}`);
  }

  function handleDelete(id: string) {
    console.log(`delete ${id}`);
  }

  type Members = {
    _id: string
    userName: string
    contact: string
    email: string
    wallet: Number
    pendingDate: Date | null
    photo: string
    createdAt: Date | null
    lastActive: Date | null
    rank: string
  }

  const data: Members[] = context?.membersData ?? []

  const columns: ColumnDef<Members>[] = [
    {
      id: "photo",
      cell: ({ row }) => {
        return (
          <img
            src={row.original.photo}
            alt="User Photo"
            className="w-[30px] h-[30px] rounded-full object-center sm:w-[150px] sm:h-[150px] sm:rounded-none"
          />
        )
      }
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
      cell: ({ row }) =>
        <Dialog>
          <DialogTrigger asChild onClick={() => handleMember(row.index)}>
            <Button className="lowercase" variant={"outline"}>
              {row.getValue("userName")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>User Profile</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            {
              selectedRow === -1 ? <></> :
                <Card>
                  <CardContent className="grid grid-cols-12 gap-4">
                    <div className="col-span-6 sm:col-span-6">
                      <Label>ID</Label>
                      <Input readOnly value={context?.membersData[selectedRow]._id} />
                    </div>
                    <div className="col-span-6 sm:col-span-6">
                      <Label>Name</Label>
                      <Input readOnly value={context?.membersData[selectedRow].userName} />
                    </div>
                    <div className="col-span-6 sm:col-span-6">
                      <Label>Contact</Label>
                      <Input readOnly value={context?.membersData[selectedRow].contact} />
                    </div>
                    <div className="col-span-6 sm:col-span-6">
                      <Label>Email</Label>
                      <Input readOnly value={context?.membersData[selectedRow].email} />
                    </div>
                    <div className="col-span-6 sm:col-span-6">
                      <Label>Pending Date</Label>
                      <Input readOnly value={context?.membersData[selectedRow].pendingDate ? new Date(context?.membersData[selectedRow].pendingDate).toLocaleDateString() : "N/A"} />
                    </div>
                    <div className="col-span-6 sm:col-span-6">
                      <Label>Wallet</Label>
                      <Input readOnly value={context?.membersData[selectedRow].wallet.toString()} />
                    </div>
                    <div className="col-span-6 sm:col-span-6">
                      <Label>Rank</Label>
                      <Input readOnly value={context?.membersData[selectedRow].rank} />
                    </div>
                    <div className="col-span-6 sm:col-span-6">
                      <Label>Created At</Label>
                      <Input readOnly value={context?.membersData[selectedRow].createdAt ? new Date(context?.membersData[selectedRow].createdAt).toLocaleDateString() : "N/A"} />
                    </div>
                    <div className="col-span-6 sm:col-span-6">
                      <Label>Last Active</Label>
                      <Input readOnly value={context?.membersData[selectedRow].lastActive ? new Date(context?.membersData[selectedRow].lastActive).toLocaleDateString() : "N/A"} />
                    </div>
                  </CardContent>
                </Card>
            }
          </DialogContent>
        </Dialog>,
      filterFn: 'includesString',
    },
    {
      accessorKey: "wallet",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Wallet
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div className="lowercase">{row.getValue("wallet")}</div>,
    },
    {
      accessorKey: "pendingDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Pending Date
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div>{row.getValue("pendingDate") ? new Date(row.getValue("pendingDate")).toLocaleDateString() : "N/A"}</div>
      ),
    },
    {
      accessorKey: "rank",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Rank
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div className="lowercase">{row.getValue("rank")}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "contact",
      header: "Contact",
      cell: ({ row }) => <div className="lowercase">{row.getValue("contact")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const member = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleUpdate(member._id)}>Update</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(member._id)}>Delete</DropdownMenuItem>
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
      getFilteredRowModel: getFilteredRowModel(),
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
        <div className="flex items-center py-4 flex-wrap gap-2">
          <Input
            placeholder="Filter user names..."
            value={(table.getColumn("userName")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("userName")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add member</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle></DialogTitle>
                <DialogDescription></DialogDescription>
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
      <h1>Members Page</h1>
      <DataTable />
    </div>
  )
}

export default MembersPages
