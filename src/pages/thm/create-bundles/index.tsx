import React, { useState, useRef, useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {
    Button,
    TextField,
    FormControl,
    Grid,
    Select,
    MenuItem,
    CircularProgress,
    InputLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Checkbox,
    FormControlLabel,

} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import axiosInterceptorInstance from "../../../utils/axios.interceptor";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const CreateBundles = () => {

    const [total_price, setTotalPrice] = useState<string>("0");
    const [discount_price, setDiscountPrice] = useState<string>("0");
    const [data, setData] = useState<string>("0");
    const [local_minutes, setLocalMinutes] = useState<string>("0");
    const [local_sms, setLocalSms] = useState<string>("0");
    const [expiry_days, setExpiryDays] = useState<string>("0");
    const [discount_percentage, setDiscountPercentage] = useState<string>("0");
    const [country_id, setCountryId] = useState<string>("0");
    const [discount_saving, setDiscountSaving] = useState<string>("0");
    const [no_of_renewals, setNoOfRenewals] = useState<string>("0");
    const [internationalMinutes, setInternationalMinutes] = useState<string>("0");
    const [internationalSms, setInternationalSms] = useState<string>("0");
    const [renewal_count, setRenewalCount] = useState<string>("0");
    const [type, setType] = useState<Number>(0);
    const [category, setCategory] = useState<Number>(0);

    const [name, setName] = useState<string>("");
    const [calling_package_id, setCallingPackageId] = useState<string>("");
    const [display_name, setDisplayName] = useState<string>("");
    const [roaming_cap, setRoamingCap] = useState<string>("");
    const [color_code, setcolorCode] = useState<string>("");
    const [dataUnit, setDataUnit] = useState<string>("");
    const [followed_by_package_id, setFollowedByPackageId] = useState<string>("");
    const [display_description, setDisplayDescription] = useState<string>("");
    const [countryCode, setCountryCode] = useState<string>("");
    const [badge_desc, setBadgeDesc] = useState<string>("");
    const [internationalResourcesCountries, setInternationalResourcesCountries] = useState<string>("");
    const [add_on_package_id, setAddOnPackageId] = useState<string>("");
    const [add_on_package_desc, setAddOnPackageDesc] = useState<string>("");
    const [commissionGroup, setCommissionGroup] = useState<string>("");
    const [cssClass, setCSSClass] = useState<string>("");

    const [isPopular, setIsPopular] = useState<boolean>(false);
    const [show_badge, setShowBadge] = useState<boolean>(false);
    const [localMinutesOrSms, setLocalMinutesOrSms] = useState<boolean>(false);
    const [internationalMinutesOrSms, setInternationalMinutesOrSms] = useState<boolean>(false);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [is_add_on, setIsAddOn] = useState<boolean>(false);
    const [isExpired, setIsExpired] = useState<boolean>(false);
    const [isRoaming, setIsRoaming] = useState<boolean>(false);
    const [is_top, setIsTop] = useState<boolean>(false);
    const [is_followed_by, setIsFollowedBy] = useState<boolean>(false);

    const [editorState, setEditorState] = useState<EditorState>();
    const agGridRef = useRef<AgGridReact | null>(null);
    const [rowdata, setRowData] = useState<any>(null);
    const [activedata, setActiveData] = useState<any>(null);
    const [exportdata, setExportData] = useState<any>(null);
    const [Open, setOpen] = useState(false);
    const [COpen, setCOpen] = useState(false);
    const [actionRequest, setActionRequest] = useState(false);
    const [exportRequest, setExportRequest] = useState(false);
    const [submitRequest, setSubmitRequest] = useState(false);
    const [nameError, setNameError] = useState<any>(false);
    const [displayNameError, setDisplayNameError] = useState<any>(false);
    const [totalPriceError, setTotalPriceError] = useState<any>(false);
    const [dataError, setDataError] = useState<any>(false);
    const [roamingError, setRoamingError] = useState<any>(false);
    const [minuteError, setMinuteError] = useState<any>(false);
    const [smsError, setSmsError] = useState<any>(false);
    const [expiryError, setExpiryError] = useState<any>(false);
    const [idError, setIdError] = useState<any>(false);
    const [typeError, setTypeError] = useState<any>(false);
    const [categoryError, setCategoryError] = useState<any>(false);
    const [dataUnitError, setDataUnitError] = useState<any>(false);


    useEffect(() => {
        if (rowdata === null)
            GetSimData();
    }, [rowdata]);

    const onEditorStateChange = (newEditorState: EditorState) => {
        setEditorState(newEditorState);
        const value = draftToHtml(convertToRaw(newEditorState.getCurrentContent()))

        setDisplayDescription(value);
    };
    const ActionsCellRenderer: React.FC<{ data: any }> = ({ data }) => {

        return (

            <Button
                onClick={() => { setOpen(true); setActiveData(data); }}
                className="dButton dButton2"
                variant="contained"
                style={{ width: "110px", height: "32px" }}

            > {data.IsActive === "True" ? "InActive" : "Active"}

            </Button>

        );
    };
    const CellRenderer: React.FC<{ data: any }> = ({ data }) => {

        return (

            <Button
                onClick={() => { setCOpen(true); setExportData(data); }
                }
                className="dButton dButton2 "
                variant="contained"
                style={{ width: "110px", height: "32px" }}
                disabled={data.IsSynced === "True"}
            > Export
            </Button>

        );
    };

    const columnDefs: ColDef[] = [
        { field: "name", headerName: "Name", filter: true, sortable: true, resizable: true },
        { field: "packageId", headerName: "ID", filter: true, sortable: true, resizable: true },
        { field: "price", headerName: "Price", filter: true, sortable: true, resizable: true },
        { field: "discount", headerName: "Discount", filter: true, sortable: true, resizable: true },
        { field: "data", headerName: "Data", filter: true, sortable: true, resizable: true },
        { field: "dataUnit", headerName: "Data Unit", filter: true, sortable: true, resizable: true },
        { headerName: 'Actions', cellRenderer: ActionsCellRenderer, },
        { headerName: 'Export', cellRenderer: CellRenderer, },

    ];
    const onGridReady = (params: { api: { sizeColumnsToFit: () => void } }) => {
        params.api.sizeColumnsToFit();
    };

    const GetSimData = async () => {
        await axiosInterceptorInstance
            .get(
                `/dashboard/GetCallingPackages`,
            )
            .then((response) => {
                const responseData = JSON.parse(response.data.body);
                setRowData(responseData.Data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const bundleUpdateRequest = async (packageId: any, IsActive: any) => {
        setActionRequest(true);
        await axiosInterceptorInstance
            .put(`/dashboard/UpdateActivation`, {
                calling_package_id: packageId,
                IsActive: (IsActive === "True" ? false : true)

            })
            .then((res: any) => {
                const responseData = JSON.parse(res.data.body);
                toast.success(responseData.message);

            })
            .catch((error: any) => {
                setOpen(false);
                setActionRequest(false);

            }).finally(() => {
                setOpen(false);
                setActionRequest(false);
                setRowData(null);
            });
    };

    const exportBundleRequest = async (packageId: any) => {
        setExportRequest(true);
        await axiosInterceptorInstance
            .post(`/dashboard/ExportCallingPackages`, {

                calling_package_id: packageId,

            })
            .then((res: any) => {

                const data = JSON.parse(res.data.body);
                toast.success(data.message);
            })
            .catch((error: any) => {
                setCOpen(false);
                setExportRequest(false);

            }).finally(() => {
                setCOpen(false);
                setExportRequest(false);
                setRowData(null);

            });
    };
    const handleGetBundles = async () => {
        toast.dismiss();
        if (name.trim() !== "" && display_name.trim() !== "" && total_price.length &&
            data.length && roaming_cap.trim() !== "" && local_minutes.length && local_sms.length
            && expiry_days.length && calling_package_id.trim() !== "" && type !== 0 && category !== 0 && dataUnit.trim() !== "") {

            AddBundle();
        }
        else {
            if (name.trim() === "") {
                setNameError(true);
            }
            if (display_name.trim() === "") {
                setDisplayNameError(true);
            }
            if (!total_price) {
                setTotalPriceError(true);
            }
            if (!data) {
                setDataError(true);
            }
            if (!local_minutes) {
                setMinuteError(true);
            }
            if (!local_sms) {
                setSmsError(true);
            }
            if (!expiry_days) {
                setExpiryError(true);
            }
            if (type === 0) {
                setTypeError(true);
            }
            if (category === 0) {
                setCategoryError(true);
            }
            if (roaming_cap.trim() === "") {
                setRoamingError(true);
            }
            if (calling_package_id.trim() === "") {
                setIdError(true);
            }
            if (dataUnit.trim() === "") {
                setDataUnitError(true);
            }
            toast.error("Please enter the required inputs.");
        }

    };

    const AddBundle = async () => {
        setSubmitRequest(true);
        await axiosInterceptorInstance
            .post(`/dashboard/AddCallingPackages`, {
                calling_package_id: calling_package_id,
                type: type,
                category: category,
                total_price: parseFloat(total_price.toString()),
                discount_price: parseFloat(discount_price.toString()),
                discount_percentage: parseFloat(discount_percentage.toString()),
                discount_saving: parseFloat(discount_saving.toString()),
                display_name: display_name,
                is_followed_by: is_followed_by,
                followed_by_package_id: followed_by_package_id === '' ? null : followed_by_package_id,
                display_description: '<div class="faq-answer">' + display_description + '</div>',
                country_id: parseFloat(country_id.toString()),
                color_code: color_code,
                no_of_renewals: parseFloat(no_of_renewals.toString()),
                expiry_days: parseFloat(expiry_days.toString()),
                localMinutes: parseFloat(local_minutes.toString()),
                localSms: parseFloat(local_sms.toString()),
                localMinutesOrSms: localMinutesOrSms,
                internationalMinutess: parseFloat(internationalMinutes.toString()),
                internationalSms: parseFloat(internationalSms.toString()),
                internationalMinutesOrSms: internationalMinutesOrSms,
                data: parseFloat(data.toString()),
                dataUnit: dataUnit,
                name: name,
                is_top: is_top,
                InternationalResourcesCountries: internationalResourcesCountries,
                CSSClass: cssClass,
                IsPopular: isPopular,
                CountryCode: countryCode,
                IsActive: isActive,
                is_add_on: is_add_on,
                add_on_package_id: add_on_package_id,
                add_on_package_desc: add_on_package_desc,
                show_badge: show_badge,
                badge_desc: badge_desc,
                IsRoaming: isRoaming,
                renewal_count: parseFloat(renewal_count.toString()),
                CommissionGroup: commissionGroup,
                IsExpired: isExpired,
                RoamingCap: roaming_cap,

            })
            .then((res: any) => {

                const data = JSON.parse(res.data.body);
                toast.success(data.message);
                setRowData(null);
            })
            .catch((error: any) => {
                setSubmitRequest(false);
            }).finally(() => {
                setSubmitRequest(false);
            });
    };
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ease: "linear", duration: 0.5 }}
        >
            <div className="boxShadow">
                <h2 className="sectionTitle">Create Bundles</h2>
                <div className="boxInner">
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <fieldset>
                                <legend>General Information:</legend>
                                <Grid container spacing={2}>
                                    <Grid item xs={3}>

                                        <TextField

                                            className={`formControl ${idError ? 'errorShow' : ''}`}
                                            label="Calling Package Id*"
                                            variant="outlined"
                                            value={calling_package_id}
                                            inputProps={{ maxLength: 200 }}
                                            onChange={(e: any) => {
                                                setCallingPackageId(e.target.value);
                                                setIdError(false)
                                            }}
                                        />

                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            className="formControl"
                                            label="Followed By Package Id "
                                            variant="outlined"
                                            value={followed_by_package_id}
                                            inputProps={{ maxLength: 200 }}
                                            onChange={(e: any) => setFollowedByPackageId(e.target.value)}
                                        />

                                    </Grid>
                                    <Grid item xs={3}>
                                        <FormControl style={{ width: "100%" }}>
                                            <InputLabel id="demo-simple-select-label" style={{ background: "#fff", padding: " 0 5px" }}>Type*</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                className={`selectControl ${typeError ? 'errorShow' : ''}`}
                                                autoWidth
                                                value={type}
                                                defaultValue={type}
                                                onChange={(e: any) => {
                                                    setType(parseInt(e.target.value));
                                                    setTypeError(false)
                                                }}
                                            >

                                                <MenuItem value="0">Choose Type</MenuItem>
                                                <MenuItem value="1"> PAYG</MenuItem>
                                                <MenuItem value="2">Rolling</MenuItem>
                                                <MenuItem value="3">TestDrive</MenuItem>
                                                <MenuItem value="4">SpecialOffer</MenuItem>
                                                <MenuItem value="5">Welcome</MenuItem>
                                                <MenuItem value="6">BoltOn</MenuItem>
                                                <MenuItem value="7">AddOn</MenuItem>
                                                <MenuItem value="8">FirstMonthOffer</MenuItem>
                                                <MenuItem value="9">PennyPro</MenuItem>
                                                <MenuItem value="10">Annual</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <FormControl style={{ width: "100%" }}>
                                            <InputLabel id="demo-simple-select-label" style={{ background: "#fff", padding: " 0 5px" }}>Category*</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                className={`selectControl ${categoryError ? 'errorShow' : ''}`}
                                                autoWidth
                                                value={category}
                                                defaultValue={category}
                                                onChange={(e: any) => {
                                                    setCategory(parseInt(e.target.value));
                                                    setCategoryError(false)
                                                }}
                                            >
                                                <MenuItem value="0">Choose Category</MenuItem>
                                                <MenuItem value="1"> National</MenuItem>
                                                <MenuItem value="2">International</MenuItem>
                                                <MenuItem value="3">DataOnly</MenuItem>
                                                <MenuItem value="4">ActivationOffer</MenuItem>
                                                <MenuItem value="5">Affiliate</MenuItem>
                                                <MenuItem value="6">TwelveMonthsContract</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </fieldset>
                        </Grid>


                        <Grid item xs={12}>
                            <fieldset>
                                <legend>Name:</legend>

                                <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                        <TextField
                                            className={`formControl ${nameError ? 'errorShow' : ''}`}
                                            label="Name*"
                                            variant="outlined"
                                            value={name}
                                            inputProps={{ maxLength: 200 }}
                                            onChange={(e: any) => {
                                                setName(e.target.value);
                                                setNameError(false)
                                            }}
                                        />

                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            className={`formControl ${displayNameError ? 'errorShow' : ''}`}
                                            label="Display Name*"
                                            variant="outlined"
                                            value={display_name}
                                            onChange={(e: any) => {
                                                setDisplayName(e.target.value);
                                                setDisplayNameError(false)
                                            }}
                                            inputProps={{ maxLength: 200 }}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            className={`formControl ${roamingError ? 'errorShow' : ''}`}
                                            label="EU Roaming Cap (GB)*"
                                            variant="outlined"
                                            value={roaming_cap}
                                            inputProps={{ maxLength: 200 }}
                                            onChange={(e: any) => {
                                                setRoamingCap(e.target.value);
                                                setRoamingError(false)
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </fieldset>
                        </Grid>

                        <Grid item xs={12}>
                            <fieldset>
                                <legend>Price:</legend>
                                <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                        <TextField
                                            className={`formControl ${totalPriceError ? 'errorShow' : ''}`}
                                            label="Total Price*"
                                            variant="outlined"
                                            value={total_price}
                                            type="number"
                                            onChange={(e: any) => {
                                                setTotalPrice(e.target.value.substring(0, 3));
                                                setTotalPriceError(false)
                                            }}
                                        />

                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            className="formControl"
                                            label="Discount Price"
                                            variant="outlined"
                                            value={discount_price}
                                            type="number"
                                            onChange={(e: any) => {
                                                const val = e.target.value.substring(0, 3);
                                                setDiscountPrice(val);
                                            }}
                                            onBlur={(e: any) => {
                                                const val = e.target.value.substring(0, 3);
                                                if (val === "") {
                                                    setDiscountPrice("0");
                                                    e.target.value = "0"
                                                }
                                            }
                                            }
                                        />

                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            className="formControl"
                                            label="Discount Percentage"
                                            variant="outlined"
                                            value={discount_percentage}
                                            type="number"
                                            onChange={(e: any) => {
                                                const val = e.target.value.substring(0, 3);
                                                setDiscountPercentage(val);
                                            }}
                                            onBlur={(e: any) => {
                                                const val = e.target.value.substring(0, 3);
                                                if (val === "") {
                                                    setDiscountPercentage("0");
                                                    e.target.value = "0"
                                                }
                                            }
                                            }
                                        />

                                    </Grid>

                                </Grid>
                            </fieldset>
                        </Grid>

                        <Grid item xs={12}>
                            <fieldset>
                                <legend>Additional:</legend>
                                <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                        <TextField
                                            className={`formControl ${dataError ? 'errorShow' : ''}`}
                                            label="Data*"
                                            variant="outlined"
                                            value={data}
                                            type="number"
                                            onChange={(e: any) => {

                                                setData(e.target.value.substring(0, 3));
                                                setDataError(false)
                                            }
                                            }

                                        />

                                    </Grid>

                                    <Grid item xs={4}>
                                        <TextField
                                            className={`formControl ${minuteError ? 'errorShow' : ''}`}
                                            label="Local Minutes*"
                                            variant="outlined"
                                            value={local_minutes}
                                            type="number"
                                            onChange={(e: any) => {

                                                setLocalMinutes(e.target.value.substring(0, 3));
                                                setMinuteError(false)
                                            }
                                            }
                                        />

                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            className={`formControl ${smsError ? 'errorShow' : ''}`}
                                            label="Local Sms*"
                                            variant="outlined"
                                            value={local_sms}
                                            type="number"
                                            onChange={(e: any) => {

                                                setLocalSms(e.target.value.substring(0, 3));
                                                setSmsError(false)
                                            }
                                            }
                                        />

                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            className={`formControl ${expiryError ? 'errorShow' : ''}`}
                                            label="Expiry Days*"
                                            variant="outlined"
                                            value={expiry_days}
                                            type="number"
                                            onChange={(e: any) => {

                                                setExpiryDays(e.target.value.substring(0, 3));
                                                setExpiryError(false);
                                            }
                                            }
                                        />

                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField

                                            className={`formControl ${dataUnitError ? 'errorShow' : ''}`}
                                            label="Data Unit*"
                                            variant="outlined"
                                            value={dataUnit}
                                            inputProps={{ maxLength: 200 }}
                                            onChange={(e: any) => {
                                                setDataUnit(e.target.value);
                                                setDataUnitError(false)
                                            }}
                                        />

                                    </Grid>

                                    <Grid item xs={4}>
                                        <TextField
                                            className="formControl"
                                            label="Renewal Count"
                                            variant="outlined"
                                            value={renewal_count}
                                            type="number"
                                            onChange={(e: any) => {
                                                const val = e.target.value.substring(0, 3);
                                                setRenewalCount(val);
                                            }}
                                            onBlur={(e: any) => {
                                                const val = e.target.value.substring(0, 3);
                                                if (val === "") {
                                                    setRenewalCount("0");
                                                    e.target.value = "0"
                                                }
                                            }
                                            }
                                        />

                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            className="formControl"
                                            label="Country Id"
                                            variant="outlined"
                                            value={country_id}
                                            type="number"
                                            onChange={(e: any) => {
                                                const val = e.target.value.substring(0, 3);
                                                setCountryId(val);
                                            }}
                                            onBlur={(e: any) => {
                                                const val = e.target.value.substring(0, 3);
                                                if (val === "") {
                                                    setCountryId("0");
                                                    e.target.value = "0"
                                                }
                                            }
                                            }
                                        />

                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            className="formControl"
                                            label="Discount Saving"
                                            variant="outlined"
                                            value={discount_saving}
                                            type="number"
                                            onChange={(e: any) => {
                                                const val = e.target.value.substring(0, 3);
                                                setDiscountSaving(val);
                                            }}
                                            onBlur={(e: any) => {
                                                const val = e.target.value.substring(0, 3);
                                                if (val === "") {
                                                    setDiscountSaving("0");
                                                    e.target.value = "0"
                                                }
                                            }
                                            }
                                        />

                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            className="formControl"
                                            label="Renewals"
                                            variant="outlined"
                                            value={no_of_renewals}
                                            type="number"
                                            onChange={(e: any) => {
                                                const val = e.target.value.substring(0, 3);
                                                setNoOfRenewals(val);
                                            }}
                                            onBlur={(e: any) => {
                                                const val = e.target.value.substring(0, 3);
                                                if (val === "") {
                                                    setNoOfRenewals("0");
                                                    e.target.value = "0"
                                                }
                                            }
                                            }
                                        />

                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            className="formControl"
                                            label="International Minutes"
                                            variant="outlined"
                                            value={internationalMinutes}
                                            type="number"
                                            onChange={(e: any) => {
                                                const val = e.target.value.substring(0, 3);
                                                setInternationalMinutes(val);
                                            }}
                                            onBlur={(e: any) => {
                                                const val = e.target.value.substring(0, 3);
                                                if (val === "") {
                                                    setInternationalMinutes("0");
                                                    e.target.value = "0"
                                                }
                                            }
                                            }
                                        />

                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            className="formControl"
                                            label="International Sms"
                                            variant="outlined"
                                            value={internationalSms}
                                            type="number"
                                            onChange={(e: any) => {
                                                const val = e.target.value.substring(0, 3);
                                                setInternationalSms(val);
                                            }}
                                            onBlur={(e: any) => {
                                                const val = e.target.value.substring(0, 3);
                                                if (val === "") {
                                                    setInternationalSms("0");
                                                    e.target.value = "0"
                                                }
                                            }
                                            }
                                        />

                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            className="formControl"
                                            label="Country Code"
                                            variant="outlined"
                                            value={countryCode}
                                            inputProps={{ maxLength: 200 }}
                                            onChange={(e: any) => setCountryCode(e.target.value)}
                                        />

                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            className="formControl"
                                            label="Badge"
                                            variant="outlined"
                                            value={badge_desc}
                                            inputProps={{ maxLength: 200 }}
                                            onChange={(e: any) => setBadgeDesc(e.target.value)}
                                        />

                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            className="formControl"
                                            label="International Resources "
                                            variant="outlined"
                                            value={internationalResourcesCountries}
                                            inputProps={{ maxLength: 200 }}
                                            onChange={(e: any) => setInternationalResourcesCountries(e.target.value)}
                                        />

                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            className="formControl"
                                            label="Add On Package Id"
                                            variant="outlined"
                                            value={add_on_package_id}
                                            inputProps={{ maxLength: 200 }}
                                            onChange={(e: any) => setAddOnPackageId(e.target.value)}
                                        />

                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            className="formControl"
                                            label="Add On Package Desc"
                                            variant="outlined"
                                            value={add_on_package_desc}
                                            inputProps={{ maxLength: 200 }}
                                            onChange={(e: any) => setAddOnPackageDesc(e.target.value)}
                                        />

                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            className="formControl"
                                            label="Commission Group"
                                            variant="outlined"
                                            value={commissionGroup}
                                            inputProps={{ maxLength: 200 }}
                                            onChange={(e: any) => setCommissionGroup(e.target.value)}
                                        />

                                    </Grid>

                                    <Grid item xs={4}>
                                        <TextField
                                            className="formControl"
                                            label="Css Class"
                                            variant="outlined"
                                            value={cssClass}
                                            inputProps={{ maxLength: 200 }}
                                            onChange={(e: any) => {
                                                setCSSClass(e.target.value)
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            className="formControl"
                                            label="Color Code"
                                            variant="outlined"
                                            type="color"
                                            value={color_code}
                                            inputProps={{ maxLength: 200 }}
                                            onChange={(e: any) => setcolorCode(e.target.value)}
                                        />

                                    </Grid>
                                </Grid>
                            </fieldset>
                        </Grid>

                        <Grid item xs={12}>
                            <fieldset>
                                <legend>Action Items:</legend>
                                <Grid container spacing={2}>
                                    <Grid item xs={3}>
                                        <FormControlLabel
                                            control={<Checkbox checked={is_top}
                                                onChange={(e: any) => setIsTop(e.target.checked)}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                                size="medium"
                                            />
                                            }
                                            label="Top"
                                            labelPlacement="start"
                                        />

                                    </Grid>
                                    <Grid item xs={3}>
                                        <FormControlLabel
                                            control={<Checkbox checked={isRoaming}
                                                onChange={(e: any) => setIsRoaming(e.target.checked)}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                                size="medium"
                                            />
                                            }
                                            label="Roaming"
                                            labelPlacement="start"
                                        />

                                    </Grid>
                                    <Grid item xs={3}>
                                        <FormControlLabel
                                            control={<Checkbox checked={isExpired}
                                                onChange={(e: any) => setIsExpired(e.target.checked)}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                                size="medium"
                                            />
                                            }
                                            label="Expired"
                                            labelPlacement="start"
                                        />

                                    </Grid>
                                    <Grid item xs={3}>
                                        <FormControlLabel
                                            control={<Checkbox checked={isActive}
                                                onChange={(e: any) => setIsActive(e.target.checked)}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                                size="medium"
                                            />
                                            }
                                            label="Active"
                                            labelPlacement="start"
                                        />

                                    </Grid>
                                    <Grid item xs={3}>
                                        <FormControlLabel
                                            control={<Checkbox checked={isPopular}
                                                onChange={(e: any) => setIsPopular(e.target.checked)}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                                size="medium"
                                            />
                                            }
                                            label="Popular"
                                            labelPlacement="start"
                                        />

                                    </Grid>
                                    <Grid item xs={3}>
                                        <FormControlLabel
                                            control={<Checkbox checked={is_add_on}
                                                onChange={(e: any) => setIsAddOn(e.target.checked)}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                                size="medium"
                                            />
                                            }
                                            label="Add On"
                                            labelPlacement="start"
                                        />

                                    </Grid>
                                    <Grid item xs={3}>
                                        <FormControlLabel
                                            control={<Checkbox checked={is_followed_by}
                                                onChange={(e: any) => setIsFollowedBy(e.target.checked)}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                                size="medium"
                                            />
                                            }
                                            label="Followed By"
                                            labelPlacement="start"
                                        />

                                    </Grid>
                                    <Grid item xs={3}>
                                        <FormControlLabel
                                            control={<Checkbox checked={show_badge}
                                                onChange={(e: any) => setShowBadge(e.target.checked)}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                                size="medium"
                                            />
                                            }
                                            label="Show Badge"
                                            labelPlacement="start"
                                        />

                                    </Grid>
                                    <Grid item xs={3}>
                                        <FormControlLabel
                                            control={<Checkbox checked={localMinutesOrSms}
                                                onChange={(e: any) => setLocalMinutesOrSms(e.target.checked)}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                                size="medium"
                                            />
                                            }
                                            label="Local Minutes/Sms"
                                            labelPlacement="start"
                                        />

                                    </Grid>
                                    <Grid item xs={3}>
                                        <FormControlLabel
                                            control={<Checkbox checked={internationalMinutesOrSms}
                                                onChange={(e: any) => setInternationalMinutesOrSms(e.target.checked)}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                                size="medium"
                                            />
                                            }
                                            label="International Minutes/Sms"
                                            labelPlacement="start"
                                        />

                                    </Grid>
                                </Grid>
                            </fieldset>
                        </Grid>
                        <Grid item xs={12}>
                            <h2 >Terms & conditions</h2>
                            <div className="boxShadow editor">
                                <Editor
                                    editorState={editorState}
                                    toolbarClassName="toolbarClassName"
                                    wrapperClassName="wrapperClassName"
                                    editorClassName="editorScrollable"
                                    onEditorStateChange={onEditorStateChange}
                                />
                            </div>
                        </Grid>
                        <Grid item xs={3} style={{ marginLeft: "35%" }}>
                            {!submitRequest && (
                                <Button
                                    className="dButton "
                                    variant="contained"
                                    onClick={() => handleGetBundles()}
                                >
                                    Submit
                                </Button>
                            )}
                            {submitRequest && (
                                <Button className="dButton " variant="contained">
                                    <CircularProgress color="inherit" size={30} />
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                </div>
            </div>
            {!rowdata && (
                <div className="dummy-conatiner">
                    <CircularProgress size={40} />
                </div>

            )
            }
            {rowdata && (
                <div className="ag-theme-alpine">
                    <AgGridReact
                        ref={agGridRef}
                        paginationPageSize={8}
                        pagination={true}
                        domLayout="autoHeight"
                        rowData={rowdata}
                        columnDefs={columnDefs}
                        onGridReady={onGridReady}

                    ></AgGridReact>
                </div>
            )}

            {activedata && <Dialog
                open={Open}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Activation Confirmation"}
                </DialogTitle>

                <DialogContent>

                    <DialogContentText id="alert-dialog-description">
                        Would you really like to {activedata.IsActive === "True" ? "InActive" : "Active"} this Bundle?
                    </DialogContentText>

                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        className="dButton dButton2 dbuttonSec"
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>
                    <div style={{ width: "30px" }}></div>
                    {!actionRequest && (
                        <Button
                            variant="contained"
                            className="dButton dButton2"
                            onClick={() => {
                                bundleUpdateRequest(activedata.packageId, activedata.IsActive);
                            }}
                            autoFocus
                        >
                            {activedata.IsActive === "True" ? "InActive" : "Active"}
                        </Button>
                    )}
                    {actionRequest && (
                        <Button className="dButton dButton2" variant="contained">
                            <CircularProgress color="inherit" size={30} />
                        </Button>
                    )}
                </DialogActions>
            </Dialog>}

            {exportdata && <Dialog
                open={COpen}
                onClose={() => setCOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Export Confirmation"}
                </DialogTitle>

                <DialogContent>

                    <DialogContentText id="alert-dialog-description">
                        Would you really like to Export this Bundle?
                    </DialogContentText>

                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        className="dButton dButton2 dbuttonSec"
                        onClick={() => setCOpen(false)}
                    >
                        Cancel
                    </Button>
                    <div style={{ width: "30px" }}></div>
                    {!exportRequest && (
                        <Button
                            variant="contained"
                            className="dButton dButton2"
                            onClick={() => {
                                exportBundleRequest(exportdata.packageId,);
                            }}
                            autoFocus
                        >
                            Export
                        </Button>
                    )}
                    {exportRequest && (
                        <Button className="dButton dButton2" variant="contained">
                            <CircularProgress color="inherit" size={30} />
                        </Button>
                    )}
                </DialogActions>
            </Dialog>}
        </motion.div>
    );
};

export default CreateBundles;
