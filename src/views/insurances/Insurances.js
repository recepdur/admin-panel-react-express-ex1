import React, { useState, useEffect } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CDataTable,
  CRow,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
  CForm,
  CAlert,
  CFormGroup,
  CInput,
  CSelect,
  CBadge,
  CCollapse,
  CSwitch,
  CLabel,
} from "@coreui/react";
// import CIcon from '@coreui/icons-react'
// import { freeSet } from '@coreui/icons'
import { execute } from "../../common/basePage";
import moment from 'moment'
import 'moment/locale/tr'

const columns = [
  //{ key: "_id", label: "id", _style: { width: "10%" } },
  { key: "startTime", label: "Başlangıç", _style: { width: "5%" } },
  //{ key: "endTime", label: "Bitiş", _style: { width: "10%" } },
  { key: "customerName", label: "Müşteri", _style: { width: "10%" } },
  { key: "description", label: "Açıklama", _style: { width: "10%" } },
  { key: "plateNo", label: "Plaka", _style: { width: "8%" } },
  { key: "carRegistNo", label: "Tescil No", _style: { width: "8%" } },
  { key: "company", label: "Şirket", _style: { width: "7%" } },
  { key: "policyNo", label: "Poliçe No", _style: { width: "7%" } },
  { key: "grossPrice", label: "Brüt", _style: { width: "5%" } },
  { key: "netPrice", label: "Net", _style: { width: "5%" } },
  { key: "commissionRate", label: "Oran", _style: { width: "5%" } },
  { key: "commissionPrice", label: "Komisyon", _style: { width: "5%" } },
  {
    key: 'show_details',
    label: '',
    _style: { width: '1%' },
    sorter: false,
    filter: false
  }
];

const Insurances = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [progressVisible, setProgressVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [insuranceList, setInsuranceList] = useState([]);
  const [insuranceDialog, setInsuranceDialog] = useState(false);
  const [insurObj, setInsurObj] = useState({});
  const [insurStatis, setInsurStatis] = useState({});
  const [isActiveObj, setIsActiveObj] = useState(true);
  const [month, setMonth] = useState(0);
  const [year, setYear] = useState(0);
  const [todayYear, setTodayYear] = useState(0);
  const [details, setDetails] = useState([]);
  const [collectionLabel, setCollectionLabel] = useState('');
  const [collectionChecked, setCollectionChecked] = useState(false);

  // eslint-disable-next-line
  useEffect(() => {
    if (isLoaded) {
      return;
    } else {
      setIsLoaded(true);
    } 
    setTodayYear(moment().year());
    moment.locale('tr');
    const newMonth = moment().month() + 1;
    const newYear = -1;//moment().year();
    setMonth(newMonth);
    setYear(newYear);
    getInsuranceList(true, newMonth, newYear); 
  });

  const callAlert = async (message, time, type) => {   
    setAlertVisible(time);
    setAlertType(type);
    setAlertMessage(message);   
  };

  const toggleDetails = (index) => {
    const position = details.indexOf(index)
    let newDetails = details.slice()
    if (position !== -1) {
      newDetails.splice(position, 1)
    } else {
      newDetails = [...details, index]
    }
    setDetails(newDetails)
  }

  const getInsuranceList = async (isAct, month, year) => {
    setDetails([]);
    getInsuranceStatistics(isAct, month, year);
    setProgressVisible(true);
    const insurData = {
      methodName: "SelectByColumns",
      data: {
        userId: localStorage.getItem("loginUserId"),
        isActive: isAct,
        month: month,
        year: year
      }
    }
    execute("/insurances", "POST", insurData, false, (response) => {
      if (response.status) {
        setInsuranceList(response.data);
      } else {
        callAlert(response.message, 3, "danger");
      }
      setProgressVisible(false);
    });
  };

  const getInsuranceStatistics = async (isAct, month, year) => {
    setProgressVisible(true);
    const insurData = {
      methodName: "SelectInsuranceStatistics",
      data: {
        userId: localStorage.getItem("loginUserId"),
        isActive: isAct,
        chartNo: 1,
        month: month,
        year: year,
      }
    }
    execute("/insurances", "POST", insurData, false, (response) => {
      if (response.status) {
        if (response.data && response.data[0])
          setInsurStatis(response.data[0]);
        else
          setInsurStatis({});
      } else {
        callAlert(response.message, 3, "danger");
      }
      setProgressVisible(false);
    });
  };

  const deleteInsurance = async (insurObj) => {
    setProgressVisible(true);
    const insurData = {
      methodName: "Update",
      data: {
        userId: localStorage.getItem("loginUserId"),
        _id: insurObj._id,
        isActive: !insurObj.isActive
      }
    }
    execute("/insurances", "POST", insurData, false, (response) => {
      if (response.status) {
        callAlert("İşlem başarılı", 2, "success");
        getInsuranceList(isActiveObj, month, year);
      } else {
        callAlert(response.message, 3, "danger");
      }
      setProgressVisible(false);
    });
  };

  const openInsuranceDialog = async (insurObj) => {
    // const insurData = {
    //   userId: localStorage.getItem("loginUserId"),
    //   _id: insurObj._id
    // };
    setInsurObj(insurObj);
    setInsuranceDialog(true);
    setCollectionChecked(false);
    setCollectionLabel('Tahsil edilmedi');
    setInsurObj({ ...insurObj, collectionPrice: 0 });
  };

  const saveInsurance = async () => {
    setProgressVisible(true);
    setInsuranceDialog(false);
    const insurData = {
      methodName: "Update",
      data: insurObj
    };
    execute("/insurances", "POST", insurData, false, (response) => {
      if (response.status) {
        callAlert("İşlem başarılı", 2, "success");
        getInsuranceList(isActiveObj, month, year);
      } else {
        callAlert(response.message, 3, "danger");
      }
      setProgressVisible(false);
    });
  };

  const insuranceChangeHandler = (e) => {
    setInsurObj({ ...insurObj, [e.target.name]: e.target.value });
  }

  const monthOnChange = (e) => {
    setMonth(e.target.value);
    getInsuranceList(isActiveObj, e.target.value, year);
  }

  const yearOnChange = (e) => {
    setYear(e.target.value);
    getInsuranceList(isActiveObj, month, e.target.value);
  }

  const convertStartTime = (time) => {
    if (!time)
      return null;

    let color = 'success';
    if (moment(time).year() < todayYear)
      color = 'warning';
    //return  moment(time).format('L');

    return (<CBadge className="mr-1" color={color}>
      <h7> {moment(time).format('L')} </h7>
    </CBadge>);
  }

  const isActiveOnChange = (e) => {
    const isAc = e.target.value;
    let isActive = true;
    if (isAc === 'true') isActive = true;
    else if (isAc === 'false') isActive = false;
    else isActive = undefined;
    setIsActiveObj(isActive);
    getInsuranceList(isActive, month, year);
  }

  const toggleCollectionChecked = () => {
    setCollectionChecked((prev) => !prev);
    if (!collectionChecked) {
      setCollectionLabel("Tahsil edildi");
      setInsurObj({ ...insurObj, collectionPrice: insurObj.grossPrice });
    } else {
      setCollectionLabel("Tahsil edilmedi");
      setInsurObj({ ...insurObj, collectionPrice: 0 });
    }
  };

  return (<>
    <CRow>
      <CCol>
        <CCard>
          <CCardBody>
            <CRow>
              <CCol sm={4}>
                <CRow>
                  <CCol sm={4}>
                    <CFormGroup className="pr-1">
                      <CSelect
                        id="ccisActive"
                        value={isActiveObj}
                        onChange={(event) => isActiveOnChange(event)} >
                        <option value="-1">Hepsi</option>
                        <option value="true">Aktif</option>
                        <option value="false">Pasif</option>
                      </CSelect>
                    </CFormGroup>
                  </CCol>
                  <CCol sm={4}>
                    <CFormGroup className="pr-1">
                      {/* <CLabel htmlFor="ccmonth">Ay</CLabel> */}
                      <CSelect
                        id="ccmonth"
                        value={month}
                        onChange={(event) => monthOnChange(event)} >
                        <option value="-1">Hepsi</option>
                        <option value="1">Ocak</option>
                        <option value="2">Şubat</option>
                        <option value="3">Mart</option>
                        <option value="4">Nisan</option>
                        <option value="5">Mayıs</option>
                        <option value="6">Haziran</option>
                        <option value="7">Temmuz</option>
                        <option value="8">Ağustos</option>
                        <option value="9">Eylül</option>
                        <option value="10">Ekim</option>
                        <option value="11">Kasım</option>
                        <option value="12">Aralık</option>
                      </CSelect>
                    </CFormGroup>
                  </CCol>
                  <CCol sm={4}>
                    <CFormGroup className="pr-1">
                      <CSelect
                        id="ccyear"
                        value={year}
                        onChange={(event) => yearOnChange(event)}>
                        <option value="-1">Hepsi</option>
                        <option>2018</option>
                        <option>2019</option>
                        <option>2020</option>
                        <option>2021</option>
                        <option>2022</option>
                        <option>2023</option>
                      </CSelect>
                    </CFormGroup>
                  </CCol>
                </CRow>
              </CCol>
              <CCol sm={1}></CCol>
              <CCol sm={7}>
                <CRow>
                  <CCol sm={3}>
                    <CFormGroup>
                      <CCol className="border border-secondary rounded" style={{ backgroundColor: "#ebedef", marginRight: "5px" }}>
                        <CCol>
                          <h7>Sayı</h7>
                        </CCol>
                        <CCol>
                          <h6>{insurStatis.totalCount ? insurStatis.totalCount : 0}</h6>
                        </CCol>
                      </CCol>
                    </CFormGroup>
                  </CCol>
                  <CCol sm={3}>
                    <CFormGroup>
                      <CCol className="border border-secondary rounded" style={{ backgroundColor: "#ebedef", marginRight: "5px" }}>
                        <CCol>
                          <h7>Brüt</h7>
                        </CCol>
                        <CCol>
                          <h6>{insurStatis.totalGrossPrice ? Number(insurStatis.totalGrossPrice.toFixed(2)) : 0}</h6>
                        </CCol>
                      </CCol>
                    </CFormGroup>
                  </CCol>
                  <CCol sm={3}>
                    <CFormGroup>
                      <CCol className="border border-secondary rounded" style={{ backgroundColor: "#ebedef", marginRight: "15px" }}>
                        <CCol>
                          <h7>Net</h7>
                        </CCol>
                        <CCol>
                          <h6>{insurStatis.totalNetPrice ? Number(insurStatis.totalNetPrice.toFixed(2)) : 0}</h6>
                        </CCol>
                      </CCol>
                    </CFormGroup>
                  </CCol>
                  <CCol sm={3}>
                    <CFormGroup>
                      <CCol className="border border-secondary rounded" style={{ backgroundColor: "#ebedef" }}>
                        <CCol>
                          <h7>Komisyon</h7>
                        </CCol>
                        <CCol>
                          <h6>{insurStatis.totalCommissionPrice ? Number(insurStatis.totalCommissionPrice.toFixed(2)) : 0}</h6>
                        </CCol>
                      </CCol>
                    </CFormGroup>
                  </CCol>
                </CRow>
              </CCol>
            </CRow>
            <CRow>
              <CCol sm="12">
                <CAlert
                  color={alertType}
                  closeButton
                  onShowChange={setAlertVisible}
                  show={alertVisible}>
                  {alertMessage}
                </CAlert>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    <CRow>
      <CCol>
        <CCard>
          <CCardBody>
            <CDataTable
              items={insuranceList}
              fields={columns}
              hover
              striped
              columnFilter
              bordered
              sorter
              responsive
              size="sm"
              itemsPerPage={100}
              pagination
              scopedSlots={{
                'startTime': (item) => (<td>{convertStartTime(item.startTime)}</td>),
                'show_details':
                  (item, index) => {
                    return (
                      <div style={{ float: 'right', margin: '3px 5px' }}>
                        <CButton
                          color="primary"
                          variant="outline"
                          shape="square"
                          size="sm"
                          onClick={() => { toggleDetails(index) }} >
                          {details.includes(index) ? 'Gizle' : 'Detay'}
                        </CButton>
                      </div>
                    )
                  },
                'details':
                  (item, index) => {
                    return (
                      <CCollapse show={details.includes(index)}>
                        <CCardBody>
                          <CButton size="sm" color="warning" variant="outline" className="ml-1" onClick={() => {
                            openInsuranceDialog(item);
                          }}>
                            Sigorta Güncelle
                        </CButton>
                          <CButton size="sm" color="danger" variant="outline" className="ml-1" onClick={() => {
                            deleteInsurance(item);
                          }}>
                            Sigorta Sil
                        </CButton>
                        </CCardBody>
                      </CCollapse>
                    )
                  }
              }} />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    <CRow>
      <CCol>
        <CModal
          style={{ width: "70%" }}
          centered
          show={progressVisible}
          onClose={setProgressVisible}
          size="sm">
          <CModalHeader closeButton>
            <CModalTitle>Lütfen bekleyiniz..</CModalTitle>
          </CModalHeader>
          <CModalBody style={{ textAlign: "center" }}>
            <CSpinner
              style={{ width: "4rem", height: "4rem" }}
              color="info"
              variant="grow"
            />
          </CModalBody>
        </CModal>
        <CModal
          size="lg"
          show={insuranceDialog}
          onClose={setInsuranceDialog}>
          <CModalHeader closeButton>
            <CModalTitle>Sigorta</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm action="" method="post">
              <CRow>
                <CCol md="6">
                  <CFormGroup row>
                    <CCol md="4">
                      <CLabel>Başlangıç Tarihi</CLabel>
                    </CCol>
                    <CCol md="8">
                      <CInput
                        type="date"
                        id="startTime"
                        name="startTime"
                        placeholder="Başlangıç Tarihi"
                        value={insurObj.startTime ? moment(insurObj.startTime).format("YYYY-MM-DD") : null}
                        onChange={(e) => {
                          const startTime = e.target.value;
                          const endTime = moment(startTime).add(1, 'years').format("YYYY-MM-DD");
                          setInsurObj({ ...insurObj, startTime, endTime });
                        }} />
                    </CCol>
                  </CFormGroup>
                </CCol>
                <CCol md="6">
                  <CFormGroup row>
                    <CCol md="4">
                      <CLabel>Bitiş Tarihi</CLabel>
                    </CCol>
                    <CCol md="8">
                      <CInput
                        type="date"
                        id="endTime"
                        name="endTime"
                        disabled={true}
                        placeholder="Bitiş Tarihi"
                        value={insurObj.endTime ? moment(insurObj.endTime).format("YYYY-MM-DD") : null}
                      />
                    </CCol>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol md="6">
                  <CFormGroup row>
                    <CCol md="4">
                      <CLabel>Açıklama</CLabel>
                    </CCol>
                    <CCol md="8">
                      <CInput
                        id="description"
                        name="description"
                        autocomplete="description"
                        placeholder="Açıklama"
                        value={insurObj.description}
                        onChange={insuranceChangeHandler}
                      />
                    </CCol>
                  </CFormGroup>
                </CCol>
                <CCol md="6">
                  <CFormGroup row>
                    <CCol md="4">
                      <CLabel>Plaka No</CLabel>
                    </CCol>
                    <CCol md="8">
                      <CInput
                        id="plateNo"
                        name="plateNo"
                        autocomplete="off"
                        placeholder="Plaka No"
                        value={insurObj.plateNo}
                        onChange={insuranceChangeHandler}
                      />
                    </CCol>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol md="6">
                  <CFormGroup row>
                    <CCol md="4">
                      <CLabel>Belge No</CLabel>
                    </CCol>
                    <CCol md="8">
                      <CInput
                        id="carRegistNo"
                        name="carRegistNo"
                        autocomplete="off"
                        placeholder="Belge No"
                        value={insurObj.carRegistNo}
                        onChange={insuranceChangeHandler}
                      />
                    </CCol>
                  </CFormGroup>
                </CCol>
                <CCol md="6">
                  <CFormGroup row>
                    <CCol md="4">
                      <CLabel>Sigorta Şirketi</CLabel>
                    </CCol>
                    <CCol md="8">
                      <CInput
                        id="company"
                        name="company"
                        autocomplete="company"
                        placeholder="Sigorta Şirketi"
                        value={insurObj.company}
                        onChange={insuranceChangeHandler}
                      />
                    </CCol>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol md="6">
                  <CFormGroup row>
                    <CCol md="4">
                      <CLabel>Poliçe No</CLabel>
                    </CCol>
                    <CCol md="8">
                      <CInput
                        id="policyNo"
                        name="policyNo"
                        autocomplete="off"
                        placeholder="Poliçe No"
                        value={insurObj.policyNo}
                        onChange={insuranceChangeHandler}
                      />
                    </CCol>
                  </CFormGroup>
                </CCol>
                <CCol md="6">
                  <CFormGroup row>
                    <CCol md="4">
                      <CLabel>Brüt</CLabel>
                    </CCol>
                    <CCol md="8">
                      <CInput
                        type="number"
                        id="grossPrice"
                        name="grossPrice"
                        autocomplete="off"
                        placeholder="Brüt"
                        value={insurObj.grossPrice}
                        onChange={insuranceChangeHandler}
                      //  onChange={(e) => { 
                      //    setInsurObj({ ...insurObj, grossPrice: e.target.value, collectionPrice: e.target.value });
                      //    //setInsurObj({ ...insurObj, collectionPrice: e.target.value }); 
                      //  }} 
                      />
                    </CCol>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol md="6">
                  <CFormGroup row>
                    <CCol md="4">
                      <CLabel>Net</CLabel>
                    </CCol>
                    <CCol md="8">
                      <CInput
                        type="number"
                        id="netPrice"
                        name="netPrice"
                        autocomplete="off"
                        placeholder="Net"
                        value={insurObj.netPrice}
                        onChange={(e) => {
                          const netPrice = e.target.value;
                          const commissionPrice = (netPrice / 100) * insurObj.commissionRate;
                          setInsurObj({ ...insurObj, netPrice, commissionPrice: Number(commissionPrice.toFixed(2)) });
                        }} />
                    </CCol>
                  </CFormGroup>
                </CCol>
                <CCol md="6">
                  <CFormGroup row>
                    <CCol md="4">
                      <CLabel>Oran</CLabel>
                    </CCol>
                    <CCol md="8">
                      <CInput
                        type="number"
                        id="commissionRate"
                        name="commissionRate"
                        autocomplete="off"
                        placeholder="Komisyon Oranı"
                        value={insurObj.commissionRate}
                        onChange={(e) => {
                          const commissionRate = e.target.value;
                          const commissionPrice = (insurObj.netPrice / 100) * commissionRate;
                          setInsurObj({ ...insurObj, commissionRate, commissionPrice: Number(commissionPrice.toFixed(2)) });
                        }} />
                    </CCol>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol md="6">
                  <CFormGroup row>
                    <CCol md="4">
                      <CLabel>Komisyon</CLabel>
                    </CCol>
                    <CCol md="8">
                      <CInput
                        type="number"
                        id="commissionPrice"
                        name="commissionPrice"
                        autocomplete="off"
                        disabled={true}
                        placeholder="Komisyon Miktarı"
                        value={insurObj.commissionPrice}
                      //onChange={insuranceChangeHandler} 
                      />
                    </CCol>
                  </CFormGroup>
                </CCol>
                <CCol md="6">
                  <CFormGroup row>
                    <CCol md="5">
                      <CFormGroup row>
                        <CCol md="4">
                          <CSwitch
                            className="mr-1"
                            color="success"
                            //defaultChecked
                            shape="pill"
                            checked={collectionChecked}
                            onChange={toggleCollectionChecked}
                          />
                        </CCol>
                        <CCol md="8">
                          <CLabel>{collectionLabel}</CLabel>
                        </CCol>
                      </CFormGroup>
                    </CCol>
                    <CCol md="7">
                      <CInput
                        type="number"
                        id="collectionPrice"
                        name="collectionPrice"
                        autocomplete="off"
                        disabled={!collectionChecked}
                        placeholder="Tahsilat Miktarı"
                        value={insurObj.collectionPrice}
                        onChange={insuranceChangeHandler}
                      />
                    </CCol>
                  </CFormGroup>
                </CCol>
              </CRow>
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="primary" onClick={() => saveInsurance()}> Kaydet </CButton>
            <CButton color="secondary" onClick={() => setInsuranceDialog(false)}> İptal </CButton>
          </CModalFooter>
        </CModal>
      </CCol>
    </CRow>
  </>);
};

export default Insurances;
