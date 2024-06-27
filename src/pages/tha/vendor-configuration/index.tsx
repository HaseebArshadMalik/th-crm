import React, { useState } from "react";
import {
    Button,
    Grid,
    TextField,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    Box,
} from "@mui/material";
import axiosInterceptorInstance from "../../../utils/axios.interceptor";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import DeleteIcon from '@mui/icons-material/Delete';


const VendorConfiguration = () => {
    const countrylist = [
        { id: '1', country: "Spain" },
        { id: '2', country: "USA" },
        { id: '3', country: "Germany" },
        { id: '4', country: "France" },
        { id: '5', country: "Italy" },
        { id: '6', country: "Canada" },
        { id: '7', country: "Australia" },
        { id: '8', country: "Poland" },
        { id: '9', country: "Mexico" },
    ];
    const providerlist = [
        { id: "1", providerList: 'G1' },
        { id: "2", providerList: 'G2' },
        { id: "3", providerList: 'G3' },
        { id: "4", providerList: 'G4' },
        { id: "5", providerList: 'G5' },
        { id: "6", providerList: 'G6' },
        { id: "7", providerList: 'G7' },
        { id: "8", providerList: 'G8' },
        { id: "9", providerList: 'G9' },
    ];
    const dummydata = [
        { countryId: "1", countryName: "Spain", providerId: "1", providerList: 'G1' },
        { countryId: "2", countryName: "USA", providerId: "2", providerList: 'G2' },
        { countryId: "3", countryName: "Germany", providerId: "3", providerList: 'G3' },
        { countryId: "4", countryName: "France", providerId: "4", providerList: 'G4' },
        { countryId: "5", countryName: "Italy", providerId: "5", providerList: 'G5' },
        { countryId: "6", countryName: "Canada", providerId: "6", providerList: 'G6' },
        { countryId: "7", countryName: "Australia", providerId: "7", providerList: 'G7' },
        { countryId: "8", countryName: "Poland", providerId: "8", providerList: 'G8' },
        { countryId: "9", countryName: "Mexico", providerId: "9", providerList: 'G9' },
    ];

    type prop = { country: string, providerList: string } | null;

    const defaultValue: prop = { country: "", providerList: "" };

    const [defaultprovider, setDefaultProvider] = useState<any>("0");
    const [countries, setCountries] = useState<prop | null>(null);
    const [serviceDestination, setServiceDestination] = useState<any>("0");
    const [listOfDestination, setListOfDestination] = useState<any>(dummydata);
    const [isCheck, setIsCheck] = useState(false);

    const handleDelete = (countryIdToDelete: any) => {

        const updatedList = listOfDestination.filter((item: any) => item.countryId !== countryIdToDelete);

        setListOfDestination(updatedList);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ease: "linear", duration: 0.5 }}
        >
            <div className="boxShadow">
                <h2 className="sectionTitle">Add Bundle</h2>
                <div className="boxInner">
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <fieldset>
                                <legend>Default Service Provider:</legend>
                                <Grid item xs={6} >
                                    <FormControl style={{ width: "100%" }}>
                                        <InputLabel id="demo-simple-select-label" style={{ background: "#fff", padding: " 0 5px" }}>
                                            List
                                        </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            className="formControl"
                                            autoWidth
                                            value={defaultprovider}
                                            defaultValue={defaultprovider}
                                            onChange={(e: any) => {
                                                setDefaultProvider(e.target.value);
                                            }}
                                        >
                                            <MenuItem value="0">Choose Type</MenuItem>
                                            {providerlist.map((item: any) => (
                                                <MenuItem value={item?.id}>{item?.providerList}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid style={{ display: "flex", justifyContent: "end" }}>
                                    <button
                                        className="small-btn"
                                        onClick={() => ""}
                                        style={{ width: "100px" }}
                                    >
                                        Save
                                    </button>

                                </Grid>
                            </fieldset>
                        </Grid>

                        <Grid item xs={12}>
                            <fieldset>
                                <legend>Service Provider By Destination:</legend>

                                <Grid style={{ display: "flex", justifyContent: "center", margin: "10px 15px" }}>
                                    <button
                                        className="small-btn"
                                        onClick={() => {
                                            setCountries(defaultValue);
                                            setIsCheck(true);
                                        }}
                                        style={{ width: "100px" }}
                                    >
                                        Add New
                                    </button>

                                </Grid>
                                <Grid item xs={12}>
                                    {listOfDestination.map((faq: any, index: number) => (
                                        <div key={faq.id} className="faq-item">
                                            <div className="faq-header">
                                                <h3 style={{ padding: "0" }}>Country:{faq.countryName}</h3>
                                                <div className="faq-header">
                                                    <DriveFileRenameOutlineOutlinedIcon className="edit-button" style={{ marginRight: "20px" }} onClick={() => {
                                                        setCountries({ country: faq.countryId, providerList: faq.providerId }); setIsCheck(false);
                                                    }}>
                                                    </DriveFileRenameOutlineOutlinedIcon>
                                                    <DeleteIcon className="edit-button" onClick={() => handleDelete(faq.countryId)} ></DeleteIcon>
                                                </div>
                                            </div>
                                            <p>Provider:{faq.providerList}</p>
                                            {index !== listOfDestination.length - 1 && <hr />}                                        </div>
                                    ))}
                                </Grid>
                            </fieldset>
                        </Grid>


                    </Grid>
                </div>
                {countries && <Dialog
                    className="operator-preview"
                    open={countries !== null}
                    onClose={() => { setCountries(null) }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <Box style={{ padding: "0 16px " }}>
                        <h1 className="heading" style={{ marginTop: "20px" }}>Add New</h1>
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <FormControl style={{ width: "100%" }}>
                                        <InputLabel id="demo-simple-select-label" style={{ background: "#fff", padding: " 0 5px" }}>
                                            Country List
                                        </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            className="formControl"
                                            autoWidth
                                            value={countries.country}
                                            defaultValue={countries.country}
                                            onChange={(e: any) => {
                                                setCountries({ country: e.target.value, providerList: countries.providerList });
                                            }}
                                        >
                                            <MenuItem value="0">Choose Type</MenuItem>
                                            {countrylist.map((item: any) => (
                                                <MenuItem value={item?.id}>{item?.country}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6} >
                                    <FormControl style={{ width: "100%" }}>
                                        <InputLabel id="demo-simple-select-label" style={{ background: "#fff", padding: " 0 5px" }}>
                                            Provider List
                                        </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            className="formControl"
                                            autoWidth
                                            value={countries.providerList}
                                            defaultValue={countries.providerList}
                                            onChange={(e: any) => {
                                                setCountries({ country: countries.country, providerList: e.target.value });
                                            }}
                                        >
                                            <MenuItem value="0">Choose Type</MenuItem>
                                            {providerlist.map((item: any) => (
                                                <MenuItem value={item?.id}>{item?.providerList}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid style={{ display: "flex", justifyContent: "center" }}>
                            <button
                                className="small-btn"
                                onClick={() => {
                                    if (isCheck) {


                                        if (countries.country != "" && countries.country != "0" && countries.providerList != "" && countries.providerList != "0") {

                                            setListOfDestination((prevList: any) => [
                                                ...prevList,
                                                {
                                                    countryId: countries.country,
                                                    countryName: countrylist.find(item => item.id === countries.country)?.country,
                                                    providerId: countries.providerList,
                                                    providerList: providerlist.find(item => item.id === countries.providerList)?.providerList
                                                }
                                            ])
                                        }
                                        else {
                                            toast.error("Please Select Required Fields ")
                                        }
                                    } else {


                                        setListOfDestination((prevList: any) =>
                                            prevList.map((item: any) => {
                                                if (item.countryId === countries.country) {
                                                    return {
                                                        ...item,
                                                        providerId: countries.providerList,
                                                        providerList: providerlist.find(item => item.id === countries.providerList)?.providerList
                                                    };
                                                }
                                                return item;
                                            })
                                        );

                                    }
                                    setCountries(null);
                                }}
                                style={{ width: "100px" }}
                            >
                                Save
                            </button>

                        </Grid>

                    </Box>
                </Dialog>}
            </div >
        </motion.div >
    );
};

export default VendorConfiguration;
