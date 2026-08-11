import { useState, useEffect } from "react";
import { Box, Typography, Divider, Autocomplete, Tab, Tabs, Alert, CircularProgress, Button, Paper, TextField } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import { customerApi, type CustomerData } from "../../Customer/api/customerApi";
import BasketTable from "./BasketTable";
import CustomerRegisterForm from "../../Customer/components/CustomerRegistrationForm";

interface BillingBasketProps{
    basket: any[];
    checkoutLoading: boolean;
    onUpdateQuantity: (id: string, delta: number) => void;
    onRemoveItem: (id: string) => void;
    onCheckoutSubmit: (customerInfo: { id: string; name: string; email: string }) => void;
}

const BillingBasket = ({
    basket, checkoutLoading, onUpdateQuantity, onRemoveItem, onCheckoutSubmit
}: BillingBasketProps) => {
    const [customerMode, setCustomerMode] = useState<number>(0)
    const [customerOptions, setCustomerOptions] = useState<any[]>([])
    const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null)
    const [searchLoading, setSearchLoading] = useState<boolean>(false)
    const [inputValue, setInputValue] = useState<string>("")

    const [searchPage, setSearchPage] = useState<number>(1)
    const [hasMoreCustomers, setHasMoreCustomers] = useState<boolean>(true)

    const [newFullName, setNewFullName] = useState<string>("")
    const [newEmail, setNewEmail] = useState<string>("")
    const [newAddress, setNewAddress] = useState<string>("")
    const [newPhone, setNewPhone] = useState<string>("")

    const [customerActionError, setCustomerActionError] = useState<string | null>(null)
    const [customerActionSuccess, setCustomerActionSuccess] = useState<string | null>(null)
    const [registerLoading, setRegisterLoading] = useState<boolean>(false)

    const fetchCustomersList = async (query: string, pageNum: number, append: boolean = false) => {
        if(!query.trim()){
            setCustomerOptions([])
            return
        }
        try{
            setSearchLoading(true)
            const response = await customerApi.getCustomers({ search: query, page: pageNum, limit: 10 })
            const serverData = response?.data?.data || response?.data || response || []
            const incomingList = Array.isArray(serverData) ? serverData : []

            setCustomerOptions((prev) => (append ? [...prev, ...incomingList] : incomingList))
            setHasMoreCustomers(incomingList.length === 10)
        } 
        catch(err){
            console.error(err)
        } 
        finally{
            setSearchLoading(false)
        }
    }

    useEffect(() => {
        setSearchPage(1)
        setHasMoreCustomers(true)

        const delayDebounceFn = setTimeout(() => {
            fetchCustomersList(inputValue, 1, false)
        }, 300)

        return () => clearTimeout(delayDebounceFn)
    }, [inputValue])

    const handleLoadMore = (e: any) => {
        e.preventDefault()
        e.stopPropagation()
        const nextPage = searchPage + 1
        setSearchPage(nextPage)
        fetchCustomersList(inputValue, nextPage, true)
    }

    const handleRegisterCustomer = async (e: any) => {
        e.preventDefault()

        if(!newFullName || !newEmail){
            setCustomerActionError("Please fill out Full Name and Email fields.")
            return
        }
        try{
            setRegisterLoading(true)
            setCustomerActionError(null)
            setCustomerActionSuccess(null)

            const payload: CustomerData = {
                fullName: newFullName,
                email: newEmail,
                address: newAddress.trim() || "N/A",
                phone: newPhone.trim() ? String(newPhone.trim()) : undefined,
            }

            const response = await customerApi.createCustomer(payload)
            const serverPayload = response?.data || response
            const createdCustomer = serverPayload?.data || serverPayload

            setCustomerActionSuccess(`Customer successfully registered!`)
            setNewFullName("")
            setNewEmail("")
            setNewAddress("")
            setNewPhone("")
            setSelectedCustomer(createdCustomer)
            setCustomerMode(0)
        } 
        catch(err: any){
            setCustomerActionError(err.response?.data?.message || "Failed to register new customer profile.")
        } 
        finally{
            setRegisterLoading(false)
        }
    }

    const handleFinalBillSubmit = (e: any) => {
        e.preventDefault()

        if (basket.length === 0 || !selectedCustomer) return

        onCheckoutSubmit({
            id: selectedCustomer.id,
            name: selectedCustomer.fullName,
            email: selectedCustomer.email,
        })

        setSelectedCustomer(null)
        setCustomerActionSuccess(null)
        setCustomerActionError(null)
    }

    const calculateTotal = () => {
        return basket.reduce((sum, item) => {
            const price = Number(item.sellingPrice) || 0
            const discount = Number(item.discountPercent) || 0
            const discountedPrice = price * (1 - discount / 100)
            return sum + discountedPrice * item.selectedQuantity
        }, 0)
    }

    if(basket.length === 0){
        return (
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", flexGrow: 1, py: 8, color: "text.disabled" }}>
                <ShoppingCartIcon sx={{ fontSize: 56, mb: 1.5 }} />
                <Typography variant="body1" fontWeight={500}>The checkout bill is empty.</Typography>
            </Box>
        )
    }

    return (
        <Box component="form" onSubmit={handleFinalBillSubmit} sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>

            <BasketTable basket={basket} onUpdateQuantity={onUpdateQuantity} onRemoveItem={onRemoveItem} />

            <Typography variant="h5" sx={{ display: "flex", justifyContent: "space-between", fontWeight: 700, mb: 2 }}>
                <span>Grand Total:</span>
                <Box component="span" sx={{ color: "primary.main" }}>₹{calculateTotal().toFixed(2)}</Box>
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ mb: 3 }}>
                <Tabs value={customerMode} onChange={(_, v) => setCustomerMode(v)} variant="fullWidth" sx={{ minHeight: 36, mb: 2 }}>
                    <Tab label="Select Customer" icon={<SearchIcon style={{ fontSize: 16 }} />} iconPosition="start" sx={{ minHeight: 36, textTransform: "none" }} />
                    <Tab label="New Customer" icon={<PersonAddIcon style={{ fontSize: 16 }} />} iconPosition="start" sx={{ minHeight: 36, textTransform: "none" }} />
                </Tabs>

                {customerActionError && <Alert severity="error" sx={{ mb: 1.5, py: 0 }}>{customerActionError}</Alert>}
                {customerActionSuccess && <Alert severity="success" sx={{ mb: 1.5, py: 0 }}>{customerActionSuccess}</Alert>}

                {customerMode === 0 ? (
                    <Autocomplete
                        fullWidth
                        size="small"
                        options={customerOptions}
                        getOptionLabel={(option) => `${option.fullName} (${option.phone || option.email})`}
                        loading={searchLoading}
                        value={selectedCustomer}
                        onChange={(_, newVal) => setSelectedCustomer(newVal)}
                        inputValue={inputValue}
                        onInputChange={(_, value) => setInputValue(value)}
                        filterOptions={(options) => options}
                        PaperComponent={(props) => (
                            <Paper {...props}>
                                {props.children}
                                {hasMoreCustomers && !searchLoading && (
                                    <Box sx={{ p: 1, display: "flex", justifyContent: "center", borderTop: "1px solid #eee" }}>
                                        <Button
                                            size="small"
                                            fullWidth
                                            variant="text"
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={handleLoadMore}
                                            sx={{ textTransform: "none", fontWeight: 600, fontSize: "0.8rem" }}
                                        >
                                            Load More Customers...
                                        </Button>
                                    </Box>
                                )}
                            </Paper>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Search & Select One Customer"
                                required={basket.length > 0}
                                slotProps={{
                                    input: {
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                                {searchLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                            </>
                                        ),
                                    },
                                }}
                            />
                        )}
                    />
                ) : (
                    <CustomerRegisterForm
                        fullName={newFullName} email={newEmail} phone={newPhone} address={newAddress} loading={registerLoading}
                        onFullNameChange={setNewFullName} onEmailChange={setNewEmail} onPhoneChange={setNewPhone} onAddressChange={setNewAddress}
                        onRegister={handleRegisterCustomer}
                        error={customerActionError}
                    />
                )}
            </Box>

            <Button
                type="submit"
                variant="contained"
                color="success"
                size="large"
                disabled={checkoutLoading || !selectedCustomer}
                sx={{ py: 1.5, fontWeight: 600, textTransform: "none", borderRadius: 2 }}
            >
                {checkoutLoading ? "Finalizing Order..." : "Confirm & Emit Bill"}
            </Button>
        </Box>
    )
}

export default BillingBasket
