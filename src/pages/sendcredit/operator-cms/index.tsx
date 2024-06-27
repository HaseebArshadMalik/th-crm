import React, { useEffect, useState } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { motion } from "framer-motion";
import { Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Editor } from "react-draft-wysiwyg";
import { ContentState, EditorState, convertFromHTML, convertToRaw } from 'draft-js';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import draftToHtml from 'draftjs-to-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { toast } from "react-toastify";
import axios from "axios";


const OperatorCms = () => {
    const [rowData, setRowData] = useState<any>([]);
    const [operator, setOperator] = useState<any>("0");
    const [section, setSection] = useState<Number>(0);
    const [title, setTitle] = useState<string>("");
    const [shortCode, setShortCode] = useState<string>("");
    const [question, setQuestion] = useState<string>("");
    const [display_description, setDisplayDescription] = useState<string>("");
    const [editorState, setEditorState] = useState<EditorState>();
    const [editorFaqState, setEditorFaqState] = useState<EditorState>();
    const [submitRequest, setSubmitRequest] = useState<boolean>(false);
    const [country, setCountry] = useState<any>("0");
    const [product, setProduct] = useState<any>("0");
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [Open, setOpen] = useState<boolean>(false);
    const [circular, setCircular] = useState<boolean>(true);
    const [about, setAbout] = useState<any>([]);
    const [countryListN, setCountryListN] = useState<any[]>([]);
    const [preview, setPreview] = useState<boolean>(false);
    const [faqs, setFaqs] = useState<any>([]);
    const [edit_faqs, setEditFaqs] = useState<any>([]);
    const [delete_faq, setDeleteFaq] = useState<any>([]);
    const [display_faq, setDisplayFaq] = useState<string>("");
    const [isCheck, setIsCheck] = useState<boolean>(false);
    const [deleteCheck, setDeleteCheck] = useState<boolean>(false);
    const [action, setAction] = useState<boolean>(false);
    const [redeem, setRedeem] = useState<boolean>(false);



    const baseURL = process.env.REACT_APP_SENDCREDIT_API_URL;

    const loadCountries = async () => {
        await fetch("/data/country.json").then(response => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        }).then((json: any) => { setCountryListN(json.countries) });
    }

    const controller = new AbortController();

    useEffect(() => {
        loadCountries();
        return () => {
            controller.abort();
        };
    }, []);


    useEffect(() => {

        if (country == "0" || country == undefined || product == "0") {
            setIsOpen(false);
            setOpen(false);
            setCircular(false);

        }
        else {
            setRowData([]);
            getOperator();
            setSection(0);
            setIsOpen(true);
            setCircular(true);
            setOperator(0);
            setFaqs([]);

        }

    }, [country, product]);


    useEffect(() => {

        if (operator != "0" && operator != undefined && section == 1) {
            getDescription(operator);
        }
    }, [operator, section]);
    useEffect(() => {

        if (operator != "0" && operator != undefined && section == 2) {
            getFAQ();
        }
    }, [operator, section]);

    useEffect(() => {
        updateEditorAndDisplayFaq();
    }, [edit_faqs]);

    useEffect(() => {

        if (operator == "0" || operator == undefined) {
            setOpen(false);
        }
        else {
            setOpen(true);
            setShortCode(operator.shortCode || "");
            setTitle(operator.operatorName || "");
            ClearFaq();

        }

    }, [operator]);

    useEffect(() => {
        const updateEditorAndDisplayDescription = () => {
            if (about.payload) {
                const blocksFromHTML = convertFromHTML(about.payload.description);
                const contentState = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
                const newEditorState = EditorState.createWithContent(contentState);
                updateDescription(newEditorState);
            } else {
                setEditorState(EditorState.createEmpty());
                setDisplayDescription("");
            }
        };

        updateEditorAndDisplayDescription();
    }, [about]);

    const updateEditorAndDisplayFaq = () => {
        if (edit_faqs && edit_faqs.answer) {
            setQuestion(edit_faqs.question);
            setRedeem(edit_faqs.isRedeem);
            const blocksFromHTML = convertFromHTML(edit_faqs.answer);
            const contentState = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
            const newEditorState = EditorState.createWithContent(contentState);
            updateEditorAndDisplay(newEditorState);
        } else {
            setEditorFaqState(EditorState.createEmpty());
            setDisplayFaq("");
            setQuestion("");
            setRedeem(false);
        }
    };

    const updateEditorAndDisplay = (newEditorState: EditorState) => {
        setEditorFaqState(newEditorState);
        const value = draftToHtml(convertToRaw(newEditorState.getCurrentContent()))
        setDisplayFaq(value);
    };

    const onEditorFaqChange = (newEditorState: EditorState) => {
        updateEditorAndDisplay(newEditorState);
    };



    const updateDescription = (newEditorState: EditorState) => {
        setEditorState(newEditorState);
        const value = draftToHtml(convertToRaw(newEditorState.getCurrentContent()))
        setDisplayDescription(value);

    }

    const onEditorStateChange = (newEditorState: EditorState) => {

        updateDescription(newEditorState);
    };

    const getOperator = async (

    ) => {
        toast.dismiss();
        await axios
            .post(
                `${baseURL}/Operator/ByProductCategory`,
                {
                    page: 1,
                    recordsPerPage: 100,
                    operatorFilters: {
                        "countryIsoCode": country.isoCode2,
                        currencyCode: "USD",
                        categoryAliasName: product
                    }
                },
                { signal: controller.signal }
            )
            .then((response: any) => {
                const responseData = (response?.data.payload);
                let finalData: any[] = [];
                responseData.forEach((item: any) => {
                    finalData.push(item.operator);
                });
                if (finalData.length == 0) {
                    toast.error("No Record Found")
                    setCircular(false);
                }
                else {
                    setRowData(finalData);
                }

            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleSave = async () => {
        toast.dismiss();
        if (title !== "" && shortCode !== "" && operator !== "0" && section == 1) {

            AddDescription();
        }
        if (title !== "" && shortCode !== "" && operator !== "0" && section == 2) {

            CheckFaqAndDescription();
        }
        else {
            toast.error("Please enter the required inputs.");
        }

    };

    const AddDescription = async () => {
        setSubmitRequest(true);
        await axios
            .post(`${baseURL}/CRMOperatorDetail/AddUpdateOperatorDetail`, {

                cRMRequestToken: "U2VuZENyZWRpdFRva2VuOkFscGhhNzg2NUA5MA==",
                operatorId: operator.operatorId,
                description: display_description,
                operatorShortCode: operator.shortCode,
            })
            .then((res: any) => {

                const data = (res.data);
                toast.success(data.message);
            })
            .catch((error: any) => {
                setSubmitRequest(false);
            }).finally(() => {
                setSubmitRequest(false);
            });
    };

    const getDescription = async (
        operator: any
    ) => {
        await axios
            .post(
                `${baseURL}/CRMOperatorDetail/GetOperatorDetailByShortCodeAsync`, {
                operatorShortCode: operator.shortCode,
                cRMRequestToken: "U2VuZENyZWRpdFRva2VuOkFscGhhNzg2NUA5MA==",

            }).then((response) => {
                const responseData = (response.data);
                setAbout(responseData);
            })
            .catch((error) => {
                console.error(error);
            });
    };
    const getFAQ = async (

    ) => {
        toast.dismiss();
        await axios
            .post(
                `${baseURL}/CRMFAQ/GetFaqByOperator`, {
                operatorShortCode: operator.shortCode,
                crmRequestToken: "U2VuZENyZWRpdFRva2VuOkFscGhhNzg2NUA5MA==",

            }).then((response) => {
                const responseData = (response?.data.payload);
                if (responseData) {
                    setFaqs(responseData);
                }
                else {
                    setFaqs([]);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };
    const AddFaq = async () => {
        setSubmitRequest(true);
        await axios
            .post(`${baseURL}/CRMFAQ/AddOperatorFAQ`, {

                operatorId: operator.operatorId,
                operatorShortCode: operator.shortCode,
                operatorName: operator.operatorName,
                question: question,
                answer: display_faq,
                isRedeem: redeem,
                crmRequestToken: "U2VuZENyZWRpdFRva2VuOkFscGhhNzg2NUA5MA==",


            })
            .then((res: any) => {

                const data = (res.data);
                toast.success(data.message);
                getFAQ();
                ClearFaq();
            })
            .catch((error: any) => {
                setSubmitRequest(false);
            }).finally(() => {
                setSubmitRequest(false);
            });
    };
    const UpdateFaq = async () => {
        setSubmitRequest(true);
        await axios
            .post(`${baseURL}/CRMFAQ/UpdateOperatorFAQ`, {

                faqId: edit_faqs.faqId,
                operatorId: operator.operatorId,
                operatorName: operator.operatorName,
                question: question,
                answer: display_faq,
                isRedeem: redeem,
                crmRequestToken: "U2VuZENyZWRpdFRva2VuOkFscGhhNzg2NUA5MA==",
            })
            .then((res: any) => {

                const data = (res.data);
                toast.success(data.message);
                getFAQ();
                ClearFaq();
            })
            .catch((error: any) => {
                setSubmitRequest(false);
            }).finally(() => {
                setSubmitRequest(false);
            });
    };

    const deleteFAQ = async () => {
        setAction(true);
        await axios
            .delete(`${baseURL}/CRMFAQ/DeleteOperatorFAQ`, {
                data: {
                    faqId: delete_faq.faqId,
                    crmRequestToken: "U2VuZENyZWRpdFRva2VuOkFscGhhNzg2NUA5MA==",
                }
            })
            .then((res: any) => {
                const data = (res.data);
                setDeleteCheck(false);
                setAction(false);
                getFAQ();
                toast.success(data.message);
            })
            .catch((error: any) => {
                setAction(false);
                setDeleteCheck(false);

            });
    };
    const ClearFaq = () => {
        setIsCheck(false);
        setQuestion("");
        setRedeem(false);
        setEditorFaqState(EditorState.createEmpty());
        setDisplayFaq("");
        setEditFaqs([]);

    }
    const CheckFaqAndDescription = () => {
        if (isCheck) {
            UpdateFaq();
        }
        else {
            AddFaq()
        }

    }
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ease: "linear", duration: 0.5 }}
        >
            <div className="boxShadow">
                <h2 className="sectionTitle">Operator CMS</h2>
                <div className="boxInner">
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <fieldset>
                                <legend>General Information:</legend>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        {countryListN && <FormControl style={{ width: "100%" }}>
                                            <InputLabel id="demo-simple-select-label" style={{ background: "#fff", padding: " 0 5px" }}>Countries</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                className="formControl"
                                                autoWidth
                                                value={country?.isoCode2 || "0"}
                                                defaultValue={country?.isoCode2 || "0"}
                                                onChange={(e: any) => {
                                                    const country = countryListN?.find(item => item.isoCode2 === e.target.value)
                                                    setCountry(country);
                                                }}
                                            >
                                                <MenuItem value="0">Select Country</MenuItem>
                                                {countryListN.map(item => (
                                                    <MenuItem value={item?.isoCode2}>{item?.countryName}</MenuItem>
                                                ))}

                                            </Select>
                                        </FormControl>}
                                    </Grid>



                                    <Grid item xs={6}>
                                        <FormControl style={{ width: "100%" }}>
                                            <InputLabel id="demo-simple-select-label" style={{ background: "#fff", padding: " 0 5px" }}>Product Type</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                className="formControl"
                                                autoWidth
                                                value={product}
                                                defaultValue={product}
                                                onChange={(e: any) => {
                                                    setProduct(e.target.value);
                                                }}
                                            >
                                                <MenuItem value="0">Choose Type</MenuItem>
                                                <MenuItem value="gift_cards"> Gift Card </MenuItem>
                                                <MenuItem value="mobile">Operator</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                </Grid>
                            </fieldset>
                        </Grid>
                        {circular == true && rowData.length == 0 && (
                            <div className="circular-loader">
                                <CircularProgress size={40} />
                            </div>
                        )}
                        {isOpen && rowData.length > 0 && (
                            <Grid item xs={12}>
                                <fieldset>
                                    <legend>Operator Selection:</legend>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <FormControl style={{ width: "100%" }}>
                                                <InputLabel id="demo-simple-select-label" style={{ background: "#fff", padding: " 0 5px" }}>Operator</InputLabel>

                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    className="formControl"

                                                    autoWidth
                                                    value={operator?.operatorId || "0"}
                                                    defaultValue={operator?.operatorId || "0"}
                                                    onChange={(e: any) => {
                                                        const operator = rowData?.find((item: any) => item.operatorId === e.target.value)

                                                        setOperator(operator);

                                                    }}
                                                >
                                                    <MenuItem value="0">Choose Type</MenuItem>

                                                    {rowData?.map((item: any) => (
                                                        <MenuItem value={item?.operatorId}>{item?.operatorName}</MenuItem>
                                                    ))}

                                                </Select>

                                            </FormControl>
                                        </Grid>


                                        <Grid item xs={6}>
                                            <FormControl style={{ width: "100%" }}>
                                                <InputLabel id="demo-simple-select-label" style={{ background: "#fff", padding: " 0 5px" }}>Section</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    className="formControl"
                                                    autoWidth
                                                    value={section}
                                                    defaultValue={section}
                                                    onChange={(e: any) => {
                                                        setSection(e.target.value);
                                                    }}
                                                >
                                                    <MenuItem value="0">Choose Type</MenuItem>
                                                    <MenuItem value="1"> About</MenuItem>
                                                    <MenuItem value="2">FAQ</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                    </Grid>
                                </fieldset>
                            </Grid>
                        )}
                        {Open && section != 0 && (
                            <Grid item xs={12}>
                                <fieldset>
                                    <legend>Operator Information:</legend>
                                    <Grid container spacing={2}>

                                        <Grid item xs={6}>
                                            <TextField

                                                className="formControl"
                                                label="Title"
                                                variant="outlined"
                                                value={title}
                                                inputProps={{ maxLength: 200 }}
                                                onChange={(e: any) => {
                                                    setTitle(e.target.value);
                                                }}
                                            />

                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField

                                                className="formControl"
                                                label="Short Code"
                                                variant="outlined"
                                                value={shortCode}
                                                inputProps={{ maxLength: 200, readOnly: true }}
                                                onChange={(e: any) => {
                                                    setShortCode(e.target.value);
                                                }}
                                            />

                                        </Grid>
                                    </Grid>
                                </fieldset>
                            </Grid>
                        )}

                        {section == 1 && country != undefined && country != "0" && product != "0" && operator != "0" && operator != undefined && (
                            <Grid item xs={12}>
                                <h2 >About Editor</h2>
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
                        )}

                        {section == 2 && faqs.length !== 0 && country !== undefined && country !== "0" && product !== "0" && operator !== "0" && operator !== undefined &&
                            (
                                <div className="faq-list-container">
                                    <h2>Frequently Asked Questions</h2>
                                    <Grid item xs={12}>
                                        {faqs.map((faq: any, index: number) => (
                                            <div key={faq.id} className="faq-item">
                                                <div className="faq-header">
                                                    <h3 style={{ padding: "0" }}>Q{faq.faqId}:{faq.question}</h3>
                                                    <div className="faq-header">
                                                        {faq.isRedeem ? <p className="Redeem">Redeem</p> : null}
                                                        <DriveFileRenameOutlineOutlinedIcon className="edit-button" style={{ marginRight: "20px" }} onClick={() => { setEditFaqs(faq), setIsCheck(true) }}></DriveFileRenameOutlineOutlinedIcon>
                                                        <DeleteIcon className="edit-button" onClick={() => { setDeleteFaq(faq), setDeleteCheck(true) }} ></DeleteIcon>
                                                    </div>
                                                </div>
                                                <p dangerouslySetInnerHTML={{ __html: faq.answer }} />
                                                <hr />
                                            </div>
                                        ))}
                                    </Grid>
                                </div>
                            )}
                        {section == 2 && country != undefined && country != "0" && product != "0" && operator != "0" && operator != undefined && (
                            <Grid item xs={12}>
                                <h2 style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>FAQ Section <Button
                                    className="dButton "
                                    variant="contained"
                                    style={{ width: "10%", height: "35px" }}
                                    onClick={() => ClearFaq()}
                                >
                                    Clear
                                </Button>
                                </h2>

                                <Grid item xs={12}>
                                    <TextField

                                        className="formControl"
                                        label="Question"
                                        variant="outlined"
                                        value={question}
                                        inputProps={{ maxLength: 200 }}
                                        onChange={(e: any) => {
                                            setQuestion(e.target.value);
                                        }}
                                    />

                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        style={{ marginLeft: "0px" }}
                                        control={<Checkbox checked={redeem}
                                            onChange={(e: any) => setRedeem(e.target.checked)}
                                            inputProps={{ 'aria-label': 'controlled' }}
                                            size="medium"
                                        />
                                        }
                                        label="Redeem"
                                        labelPlacement="start"
                                    />

                                </Grid>
                                <h2 >Answer</h2>
                                <div className="boxShadow editor">
                                    <Editor
                                        editorState={editorFaqState}
                                        toolbarClassName="toolbarClassName"
                                        wrapperClassName="wrapperClassName"
                                        editorClassName="editorScrollable"
                                        onEditorStateChange={onEditorFaqChange}
                                    />
                                </div>
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={3} style={{ marginLeft: "30%" }}>
                                    {!submitRequest && Open && section != 0 && (
                                        <Button
                                            className="dButton "
                                            variant="contained"
                                            onClick={() => handleSave()}
                                        >
                                            Save
                                        </Button>
                                    )}
                                    {submitRequest && (
                                        <Button className="dButton " variant="contained">
                                            <CircularProgress color="inherit" size={30} />
                                        </Button>
                                    )}
                                </Grid>
                                <Grid item xs={3}>
                                    {display_description && country != undefined && country != "0" && product != "0" && operator != "0" && operator != undefined && section == 1 && (
                                        <Button
                                            className="dButton "
                                            variant="contained"
                                            onClick={() => setPreview(true)}
                                        >
                                            Preview
                                        </Button>
                                    )}

                                </Grid>
                            </Grid>
                        </Grid>


                        <Dialog
                            className="operator-preview"
                            open={preview}
                            onClose={() => setPreview(false)}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"

                        >

                            <div dangerouslySetInnerHTML={{ __html: display_description }} />


                        </Dialog>

                        <Dialog
                            open={deleteCheck}
                            onClose={() => setDeleteCheck(false)}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">
                                {"Delete FAQ Confirmation"}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Would you really like to delete this FAQ?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    variant="contained"
                                    className="dButton dButton2 dbuttonSec"
                                    onClick={() => setDeleteCheck(false)}
                                >
                                    No
                                </Button>
                                <div style={{ width: "30px" }}></div>
                                {!action && (
                                    <Button
                                        variant="contained"
                                        className="dButton dButton2"
                                        onClick={() => {
                                            deleteFAQ();
                                        }}
                                        autoFocus
                                    >
                                        Yes
                                    </Button>
                                )}
                                {action && (
                                    <Button className="dButton dButton2" variant="contained">
                                        <CircularProgress color="inherit" size={30} />
                                    </Button>
                                )}
                            </DialogActions>
                        </Dialog>
                    </Grid>
                </div>
            </div>

        </motion.div>
    );
};

export default OperatorCms;
