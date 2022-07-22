import React, { useState, useEffect } from 'react'
import {
  CContainer,
  CRow,
  CButton,
  CCard,
  CCardBody,
  CCol,
  //CDataTable,
  //CSmartTable,
  CTable,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
  CForm,
  CAlert,
  //CFormGroup,
  //CInput,
  CInputGroup,
  CFormInput,
  //CSelect,
  CFormSelect,
  CCollapse,
  //Clabel ,
  CFormLabel,
  //CSwitch,
  CFormSwitch,
} from '@coreui/react'
import { execute } from '../../common/basePage'
import moment from 'moment'
import 'moment/locale/tr'

const customerColumns = [
  { key: 'firstName', label: 'Adı', _style: { width: '10%' } },
  { key: 'lastName', label: 'Soyadı', _style: { width: '10%' } },
  { key: 'tcNo', label: 'Tc No', _style: { width: '10%' } },
  { key: 'phone', label: 'Telefon', _style: { width: '10%' } },
  //{ key: "email", label: "E-Posta", _style: { width: "10%" } },
  { key: 'created', label: 'Kayıt Tarihi', _style: { width: '5%' } },
  //{ key: "updated", label: "Güncelleme T.", _style: { width: "5%" } },
  {
    key: 'show_details',
    label: '',
    _style: { width: '1%' },
    sorter: false,
    filter: false,
  },
]

const insuranceColumns = [
  //{ key: "_id", label: "id", _style: { width: "10%" } },
  { key: 'customerName', label: 'Müşteri', _style: { width: '10%' } },
  { key: 'startTime', label: 'Başlangıç', _style: { width: '5%' } },
  //{ key: "endTime", label: "Bitiş", _style: { width: "10%" } },
  // { key: "tcNo", label: "TC No", _style: { width: "10%" } },
  // { key: "phone", label: "Telefon", _style: { width: "10%" } },
  { key: 'plateNo', label: 'Plaka', _style: { width: '7%' } },
  // { key: "carRegistNo", label: "Tescil No", _style: { width: "10%" } },
  // { key: "company", label: "Şirket", _style: { width: "10%" } },
  // { key: "policyNo", label: "Poliçe No", _style: { width: "10%" } },
  { key: 'grossPrice', label: 'Brüt', _style: { width: '5%' } },
  { key: 'netPrice', label: 'Net', _style: { width: '5%' } },
  { key: 'commissionRate', label: 'Oran', _style: { width: '5%' } },
  { key: 'commissionPrice', label: 'Komisyon', _style: { width: '5%' } },
  { key: 'description', label: 'Açıklama', _style: { width: '10%' } },
]

const accountColumns = [
  { key: 'customerName', label: 'Müşteri', _style: { width: '10%' } },
  { key: 'tranDate', label: 'Tarih', _style: { width: '7%' } },
  { key: 'tranTypeName', label: 'İşlem', _style: { width: '7%' } },
  { key: 'loanAmount', label: 'Borç', _style: { width: '5%' } },
  { key: 'creditAmount', label: 'Alındı', _style: { width: '5%' } },
  { key: 'description', label: 'Açıklama', _style: { width: '10%' } },
]

const Customers = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [progressVisible, setProgressVisible] = useState(false)
  const [alertVisible, setAlertVisible] = useState(false)
  const [alertType, setAlertType] = useState('')
  const [alertMessage, setAlertMessage] = useState('')
  const [customerList, setCustomerList] = useState([])
  const [customerDialog, setCustomerDialog] = useState(false)
  const [insuranceDialog, setInsuranceDialog] = useState(false)
  const [insuranceListDialog, setInsuranceListDialog] = useState(false)
  const [insuranceList, setInsuranceList] = useState([])
  const [isUpdateCustomer, setIsUpdateCustomer] = useState(false)
  const [cusObj, setCusObj] = useState({})
  const [cusStatis, setCusStatis] = useState({})
  const [insurObj, setInsurObj] = useState({})
  const [accountObj, setAccountObj] = useState({})
  const [accountDialog, setAccountDialog] = useState(false)
  const [accountListDialog, setAccountListDialog] = useState(false)
  const [accountList, setAccountList] = useState([])
  const [isActiveObj, setIsActiveObj] = useState(true)
  const [details, setDetails] = useState([])
  const [collectionLabel, setCollectionLabel] = useState('')
  const [collectionChecked, setCollectionChecked] = useState(false)

  // eslint-disable-next-line
  useEffect(() => {
    if (isLoaded) {
      return
    } else {
      setIsLoaded(true)
    }
    moment.locale('tr')
    getCustomerList(true)
    //callAlert("Alert test!", 3, "danger");
  })

  const callAlert = async (message, time, type) => {
    setAlertVisible(time)
    setAlertType(type)
    setAlertMessage(message)
  }

  const getCustomerList = async (isAct) => {
    setDetails([])
    //getCustomerStatistics(isAct)
    setProgressVisible(true)
    const cusData = {
      methodName: 'SelectByColumns',
      data: {
        userId: localStorage.getItem('loginUserId'),
        isActive: isAct,
      },
    }
    execute('/api/customers', 'POST', cusData, false, (response) => {
      if (response.success) {
        setCustomerList(response.data)
      } else {
        callAlert(response.message, 3, 'danger')
      }
      setProgressVisible(false)
    })
  }

  const getCustomerStatistics = async (isAct) => {
    setProgressVisible(true)
    const insurData = {
      methodName: 'SelectCustomerStatistics',
      data: {
        userId: localStorage.getItem('loginUserId'),
        isActive: isAct,
      },
    }
    execute('/api/customers', 'POST', insurData, false, (response) => {
      if (response.status) {
        if (response.data && response.data[0]) setCusStatis(response.data[0])
        else setCusStatis({})
      } else {
        callAlert(response.message, 3, 'danger')
      }
      setProgressVisible(false)
    })
  }

  const deleteCustomer = async (cusObj) => {
    setProgressVisible(true)
    const cusData = {
      methodName: 'Update',
      data: {
        userId: localStorage.getItem('loginUserId'),
        _id: cusObj._id,
        isActive: !cusObj.isActive,
        tcNo: cusObj.tcNo,
      },
    }
    execute('/customers', 'POST', cusData, false, (response) => {
      if (response.status) {
        callAlert('İşlem başarılı', 2, 'success')
        getCustomerList(isActiveObj)
      } else {
        callAlert(response.message, 3, 'danger')
      }
      setProgressVisible(false)
    })
  }

  const openCustomerDialog = async (isUpdate, cusObj) => {
    if (isUpdate) {
      cusObj.phone = cusObj.phone.replace(/\s+/g, '')
      setCusObj(cusObj)
    } else {
      const newCus = {
        userId: localStorage.getItem('loginUserId'),
        firstName: '',
        lastName: '',
        tcNo: '',
        phone: '',
        email: '',
      }
      setCusObj(newCus)
    }
    setIsUpdateCustomer(isUpdate)
    setCustomerDialog(true)
  }

  const saveCustomer = async () => {
    setProgressVisible(true)
    setCustomerDialog(false)
    const cusData = {
      methodName: isUpdateCustomer ? 'Update' : 'Insert',
      data: cusObj,
    }
    execute('/customers', 'POST', cusData, false, (response) => {
      if (response.status) {
        callAlert('İşlem başarılı', 2, 'success')
        getCustomerList(isActiveObj)
      } else {
        callAlert(response.message, 3, 'danger')
      }
      setProgressVisible(false)
    })
  }

  const customerChangeHandler = (e) => {
    setCusObj({ ...cusObj, [e.target.name]: e.target.value })
  }

  const openInsuranceDialog = async (cusObj) => {
    const insurObj = {
      userId: localStorage.getItem('loginUserId'),
      customerId: cusObj._id,
      startTime: moment().format(),
      endTime: moment().add(1, 'years').format(),
      description: '',
      plateNo: '',
      carRegistNo: '',
      company: '',
      policyNo: '',
      grossPrice: '',
      netPrice: '',
      commissionRate: '',
      commissionPrice: '',
    }
    setInsurObj(insurObj)
    setInsuranceDialog(true)
    setCollectionChecked(false)
    setCollectionLabel('Tahsil edilmedi')
    setInsurObj({ ...insurObj, collectionPrice: 0 })
  }

  const openInsuranceListDialog = async (cusObj) => {
    setInsuranceListDialog(true)
    setProgressVisible(true)
    const insurData = {
      methodName: 'SelectByColumns',
      data: {
        userId: localStorage.getItem('loginUserId'),
        customerId: cusObj._id,
      },
    }
    execute('/insurances', 'POST', insurData, false, (response) => {
      if (response.status) {
        setInsuranceList(response.data)
      } else {
        callAlert(response.message, 3, 'danger')
      }
      setProgressVisible(false)
    })
  }

  const saveInsurance = async () => {
    setProgressVisible(true)
    setInsuranceDialog(false)

    insurObj.startTime = moment(insurObj.startTime).format()
    insurObj.endTime = moment(insurObj.startTime).format()

    const insurData = {
      methodName: 'Insert',
      data: insurObj,
    }
    execute('/insurances', 'POST', insurData, false, (response) => {
      if (response.status) {
        callAlert('İşlem başarılı', 2, 'success')
      } else {
        callAlert(response.message, 3, 'danger')
      }
      setProgressVisible(false)
    })
  }

  const insuranceChangeHandler = (e) => {
    setInsurObj({ ...insurObj, [e.target.name]: e.target.value })
  }

  const isActiveOnChange = (e) => {
    const isAc = e.target.value
    let isActive = true
    if (isAc === 'true') isActive = true
    else if (isAc === 'false') isActive = false
    else isActive = undefined
    setIsActiveObj(isActive)
    getCustomerList(isActive)
  }

  const convertDate = (time, dateFormat = 'L') => {
    if (!time) return null
    return moment(time).format(dateFormat)
  }

  const openAccountDialog = async (cusObj) => {
    const accountObj = {
      userId: localStorage.getItem('loginUserId'),
      customerId: cusObj._id,
      customerName: cusObj.firstName + ' ' + cusObj.lastName,
      tranDate: moment().format(),
      description: '',
      tranType: 'l',
      loanAmount: 0,
      creditAmount: 0,
    }
    setAccountObj(accountObj)
    setAccountDialog(true)
  }

  const openAccountListDialog = async (cusObj) => {
    setAccountListDialog(true)
    setProgressVisible(true)
    const accountData = {
      methodName: 'SelectByColumns',
      data: {
        userId: localStorage.getItem('loginUserId'),
        customerId: cusObj._id,
      },
    }
    execute('/accounts', 'POST', accountData, false, (response) => {
      if (response.status) {
        setAccountList(response.data)
      } else {
        callAlert(response.message, 3, 'danger')
      }
      setProgressVisible(false)
    })
  }

  const saveAccount = async () => {
    setProgressVisible(true)
    setAccountDialog(false)

    accountObj.tranDate = moment(accountObj.tranDate).format()

    const accountData = {
      methodName: 'Insert',
      data: accountObj,
    }
    execute('/accounts', 'POST', accountData, false, (response) => {
      if (response.status) {
        callAlert('İşlem başarılı', 2, 'success')
      } else {
        callAlert(response.message, 3, 'danger')
      }
      setProgressVisible(false)
    })
  }

  const accountChangeHandler = (e) => {
    setAccountObj({ ...accountObj, [e.target.name]: e.target.value })
  }

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

  const toggleCollectionChecked = () => {
    setCollectionChecked((prev) => !prev)
    if (!collectionChecked) {
      setCollectionLabel('Tahsil edildi')
      setInsurObj({ ...insurObj, collectionPrice: insurObj.grossPrice })
    } else {
      setCollectionLabel('Tahsil edilmedi')
      setInsurObj({ ...insurObj, collectionPrice: 0 })
    }
  }

  return (
    <CContainer>
      <CRow>
        <CCol>
          <CCard>
            <CCardBody>
              <CRow>
                <CCol sm={6}>
                  <CRow>
                    <CCol sm={3}>
                      <CInputGroup>
                        <CFormSelect
                          id="ccisActive"
                          value={isActiveObj}
                          onChange={(event) => isActiveOnChange(event)}
                        >
                          <option value="-1">Hepsi</option>
                          <option value="true">Aktif</option>
                          <option value="false">Pasif</option>
                        </CFormSelect>
                      </CInputGroup>
                    </CCol>
                    <CCol sm={3}>
                      <CInputGroup>
                        <CButton
                          block
                          variant="outline"
                          color="success"
                          onClick={() => {
                            openCustomerDialog(false, null)
                          }}
                        >
                          Ekle
                        </CButton>
                      </CInputGroup>
                    </CCol>
                  </CRow>
                </CCol>
                <CCol sm={6}>
                  <CRow>
                    <CCol sm={4}>
                      <CInputGroup>
                        <CCol
                          className="border border-secondary rounded"
                          style={{ backgroundColor: '#ebedef', marginRight: '10px' }}
                        >
                          <CCol>
                            <h7>Sayı</h7>
                          </CCol>
                          <CCol>
                            <h6>{cusStatis.totalCount ? cusStatis.totalCount : 0}</h6>
                          </CCol>
                        </CCol>
                      </CInputGroup>
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
                    show={alertVisible}
                  >
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
              <CTable
                items={customerList}
                fields={customerColumns}
                hover
                striped
                columnFilter
                bordered
                sorter
                responsive
                size="sm"
                itemsPerPage={50}
                pagination
                scopedSlots={{
                  created: (item) => <td>{convertDate(item.created, 'DD.MM.YYYY HH:mm')}</td>,
                  //'updated': (item) => (<td>{convertDate(item.updated,'DD.MM.YYYY HH:mm')}</td>),
                  show_details: (item, index) => {
                    return (
                      <div style={{ float: 'right', margin: '3px 5px' }}>
                        <CButton
                          color="primary"
                          variant="outline"
                          shape="square"
                          size="sm"
                          onClick={() => {
                            toggleDetails(index)
                          }}
                        >
                          {details.includes(index) ? 'Gizle' : 'Detay'}
                        </CButton>
                        {/* <CBadge className="mr-1" href="#" color="success" shape="pill"
                        onClick={() => { toggleDetails(index) }} > 
                      {
                      details.includes(index) 
                        ? <CIcon content={freeSet.cilArrowBottom} /> 
                        : <CIcon content={freeSet.cilArrowTop} />
                      }
                    </CBadge> */}
                      </div>
                    )
                  },
                  details: (item, index) => {
                    return (
                      <CCollapse show={details.includes(index)}>
                        <CCardBody>
                          <CButton
                            size="sm"
                            color="info"
                            variant="outline"
                            className="ml-1"
                            onClick={() => {
                              openInsuranceListDialog(item)
                            }}
                          >
                            Sigorta Listeleme
                          </CButton>
                          <CButton
                            size="sm"
                            color="success"
                            variant="outline"
                            className="ml-1"
                            onClick={() => {
                              openInsuranceDialog(item)
                            }}
                          >
                            Sigorta Ekle
                          </CButton>
                          <> -</>
                          <CButton
                            size="sm"
                            color="warning"
                            variant="outline"
                            className="ml-1"
                            onClick={() => {
                              openCustomerDialog(true, item)
                            }}
                          >
                            {' '}
                            Müşteri Güncelle
                          </CButton>
                          <CButton
                            size="sm"
                            color="danger"
                            variant="outline"
                            className="ml-1"
                            onClick={() => {
                              deleteCustomer(item)
                            }}
                          >
                            Müşteri Sil
                          </CButton>
                          <> - </>
                          <CButton
                            size="sm"
                            color="info"
                            variant="outline"
                            onClick={() => {
                              openAccountListDialog(item)
                            }}
                          >
                            Hesap Listeleme
                          </CButton>
                          <CButton
                            size="sm"
                            color="success"
                            variant="outline"
                            className="ml-1"
                            onClick={() => {
                              openAccountDialog(item)
                            }}
                          >
                            Hesap Ekle
                          </CButton>
                        </CCardBody>
                      </CCollapse>
                    )
                  },
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <CModal
            style={{ width: '70%' }}
            centered
            show={progressVisible}
            onClose={setProgressVisible}
            size="sm"
          >
            <CModalHeader closeButton>
              <CModalTitle>Lütfen bekleyiniz..</CModalTitle>
            </CModalHeader>
            <CModalBody style={{ textAlign: 'center' }}>
              <CSpinner style={{ width: '4rem', height: '4rem' }} color="info" variant="grow" />
            </CModalBody>
          </CModal>
          <CModal
            //size="sm"
            show={customerDialog}
            onClose={setCustomerDialog}
          >
            <CModalHeader closeButton>
              <CModalTitle>Müşteri</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CForm action="" method="post">
                <CInputGroup row>
                  <CCol md="2">
                    <CFormLabel>Adı</CFormLabel>
                  </CCol>
                  <CCol md="10">
                    <CFormInput
                      id="firstName"
                      name="firstName"
                      autocomplete="off"
                      placeholder="Adı"
                      value={cusObj.firstName}
                      onChange={(event) => customerChangeHandler(event)}
                    />
                  </CCol>
                </CInputGroup>
                <CInputGroup row>
                  <CCol md="2">
                    <CFormLabel>Soyadı</CFormLabel>
                  </CCol>
                  <CCol md="10">
                    <CFormInput
                      id="lastName"
                      name="lastName"
                      autocomplete="off"
                      placeholder="Soyadı"
                      value={cusObj.lastName}
                      onChange={customerChangeHandler}
                    />
                  </CCol>
                </CInputGroup>
                <CInputGroup row>
                  <CCol md="2">
                    <CFormLabel>TC No</CFormLabel>
                  </CCol>
                  <CCol md="10">
                    <CFormInput
                      type="number"
                      pattern="[0-9]*"
                      required
                      id="tcNo"
                      name="tcNo"
                      autocomplete="off"
                      placeholder="TC No"
                      value={cusObj.tcNo}
                      onChange={customerChangeHandler}
                    />
                  </CCol>
                </CInputGroup>
                <CInputGroup row>
                  <CCol md="2">
                    <CFormLabel>Telefon</CFormLabel>
                  </CCol>
                  <CCol md="10">
                    <CFormInput
                      type="number"
                      id="phone"
                      name="phone"
                      autocomplete="off"
                      placeholder="Telefon"
                      value={cusObj.phone}
                      onChange={customerChangeHandler}
                    />
                  </CCol>
                </CInputGroup>
                <CInputGroup row>
                  <CCol md="2">
                    <CFormLabel>E-Posta</CFormLabel>
                  </CCol>
                  <CCol md="10">
                    <CFormInput
                      type="email"
                      id="email"
                      name="email"
                      autocomplete="off"
                      placeholder="E-Posta"
                      value={cusObj.email}
                      onChange={customerChangeHandler}
                    />
                  </CCol>
                </CInputGroup>
              </CForm>
            </CModalBody>
            <CModalFooter>
              <CButton color="primary" onClick={() => saveCustomer()}>
                Kaydet
              </CButton>
              <CButton color="secondary" onClick={() => setCustomerDialog(false)}>
                İptal
              </CButton>
            </CModalFooter>
          </CModal>
          <CModal size="lg" show={insuranceDialog} onClose={setInsuranceDialog}>
            <CModalHeader closeButton>
              <CModalTitle>Sigorta</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CForm action="" method="post">
                <CRow>
                  <CCol md="6">
                    <CInputGroup row>
                      <CCol md="4">
                        <CFormLabel>Başlangıç Tarihi</CFormLabel>
                      </CCol>
                      <CCol md="8">
                        <CFormInput
                          type="date"
                          id="startTime"
                          name="startTime"
                          placeholder="Başlangıç Tarihi"
                          value={
                            insurObj.startTime
                              ? moment(insurObj.startTime).format('YYYY-MM-DD')
                              : null
                          }
                          onChange={(e) => {
                            const startTime = e.target.value
                            const endTime = moment(startTime).add(1, 'years').format('YYYY-MM-DD')
                            setInsurObj({ ...insurObj, startTime, endTime })
                          }}
                        />
                      </CCol>
                    </CInputGroup>
                  </CCol>
                  <CCol md="6">
                    <CInputGroup row>
                      <CCol md="4">
                        <CFormLabel>Bitiş Tarihi</CFormLabel>
                      </CCol>
                      <CCol md="8">
                        <CFormInput
                          type="date"
                          id="endTime"
                          name="endTime"
                          disabled={true}
                          placeholder="Bitiş Tarihi"
                          value={
                            insurObj.endTime ? moment(insurObj.endTime).format('YYYY-MM-DD') : null
                          }
                        />
                      </CCol>
                    </CInputGroup>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="6">
                    <CInputGroup row>
                      <CCol md="4">
                        <CFormLabel>Açıklama</CFormLabel>
                      </CCol>
                      <CCol md="8">
                        <CFormInput
                          id="description"
                          name="description"
                          autocomplete="description"
                          placeholder="Açıklama"
                          value={insurObj.description}
                          onChange={insuranceChangeHandler}
                        />
                      </CCol>
                    </CInputGroup>
                  </CCol>
                  <CCol md="6">
                    <CInputGroup row>
                      <CCol md="4">
                        <CFormLabel>Plaka No</CFormLabel>
                      </CCol>
                      <CCol md="8">
                        <CFormInput
                          id="plateNo"
                          name="plateNo"
                          autocomplete="off"
                          placeholder="Plaka No"
                          value={insurObj.plateNo}
                          onChange={insuranceChangeHandler}
                        />
                      </CCol>
                    </CInputGroup>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="6">
                    <CInputGroup row>
                      <CCol md="4">
                        <CFormLabel>Belge No</CFormLabel>
                      </CCol>
                      <CCol md="8">
                        <CFormInput
                          id="carRegistNo"
                          name="carRegistNo"
                          autocomplete="off"
                          placeholder="Belge No"
                          value={insurObj.carRegistNo}
                          onChange={insuranceChangeHandler}
                        />
                      </CCol>
                    </CInputGroup>
                  </CCol>
                  <CCol md="6">
                    <CInputGroup row>
                      <CCol md="4">
                        <CFormLabel>Sigorta Şirketi</CFormLabel>
                      </CCol>
                      <CCol md="8">
                        <CFormInput
                          id="company"
                          name="company"
                          autocomplete="company"
                          placeholder="Sigorta Şirketi"
                          value={insurObj.company}
                          onChange={insuranceChangeHandler}
                        />
                      </CCol>
                    </CInputGroup>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="6">
                    <CInputGroup row>
                      <CCol md="4">
                        <CFormLabel>Poliçe No</CFormLabel>
                      </CCol>
                      <CCol md="8">
                        <CFormInput
                          id="policyNo"
                          name="policyNo"
                          autocomplete="off"
                          placeholder="Poliçe No"
                          value={insurObj.policyNo}
                          onChange={insuranceChangeHandler}
                        />
                      </CCol>
                    </CInputGroup>
                  </CCol>
                  <CCol md="6">
                    <CInputGroup row>
                      <CCol md="4">
                        <CFormLabel>Brüt</CFormLabel>
                      </CCol>
                      <CCol md="8">
                        <CFormInput
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
                    </CInputGroup>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="6">
                    <CInputGroup row>
                      <CCol md="4">
                        <CFormLabel>Net</CFormLabel>
                      </CCol>
                      <CCol md="8">
                        <CFormInput
                          type="number"
                          id="netPrice"
                          name="netPrice"
                          autocomplete="off"
                          placeholder="Net"
                          value={insurObj.netPrice}
                          onChange={(e) => {
                            const netPrice = e.target.value
                            const commissionPrice = (netPrice / 100) * insurObj.commissionRate
                            setInsurObj({
                              ...insurObj,
                              netPrice,
                              commissionPrice: Number(commissionPrice.toFixed(2)),
                            })
                          }}
                        />
                      </CCol>
                    </CInputGroup>
                  </CCol>
                  <CCol md="6">
                    <CInputGroup row>
                      <CCol md="4">
                        <CFormLabel>Oran</CFormLabel>
                      </CCol>
                      <CCol md="8">
                        <CFormInput
                          type="number"
                          id="commissionRate"
                          name="commissionRate"
                          autocomplete="off"
                          placeholder="Komisyon Oranı"
                          value={insurObj.commissionRate}
                          onChange={(e) => {
                            const commissionRate = e.target.value
                            const commissionPrice = (insurObj.netPrice / 100) * commissionRate
                            setInsurObj({
                              ...insurObj,
                              commissionRate,
                              commissionPrice: Number(commissionPrice.toFixed(2)),
                            })
                          }}
                        />
                      </CCol>
                    </CInputGroup>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="6">
                    <CInputGroup row>
                      <CCol md="4">
                        <CFormLabel>Komisyon</CFormLabel>
                      </CCol>
                      <CCol md="8">
                        <CFormInput
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
                    </CInputGroup>
                  </CCol>
                  <CCol md="6">
                    <CInputGroup row>
                      <CCol md="5">
                        <CInputGroup row>
                          <CCol md="4">
                            <CFormSwitch
                              className="mr-1"
                              color="success"
                              //defaultChecked
                              shape="pill"
                              checked={collectionChecked}
                              onChange={toggleCollectionChecked}
                            />
                          </CCol>
                          <CCol md="8">
                            <CFormLabel>{collectionLabel}</CFormLabel>
                          </CCol>
                        </CInputGroup>
                      </CCol>
                      <CCol md="7">
                        <CFormInput
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
                    </CInputGroup>
                  </CCol>
                </CRow>
              </CForm>
            </CModalBody>
            <CModalFooter>
              <CButton color="primary" onClick={() => saveInsurance()}>
                {' '}
                Kaydet{' '}
              </CButton>
              <CButton color="secondary" onClick={() => setInsuranceDialog(false)}>
                {' '}
                İptal{' '}
              </CButton>
            </CModalFooter>
          </CModal>
          <CModal size="lg" show={insuranceListDialog} onClose={setInsuranceListDialog}>
            <CModalHeader closeButton>
              <CModalTitle>Sigorta Listesi</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CTable
                items={insuranceList}
                fields={insuranceColumns}
                hover
                striped
                columnFilter={false}
                bordered
                sorter
                responsive
                size="sm"
                itemsPerPage={10}
                pagination
                scopedSlots={{
                  startTime: (item) => <td>{convertDate(item.startTime)}</td>,
                }}
              />
            </CModalBody>
          </CModal>
          <CModal show={accountDialog} onClose={setAccountDialog}>
            <CModalHeader closeButton>
              <CModalTitle>Hesap Ekle</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CForm action="" method="post">
                <CInputGroup row>
                  <CCol md="6">
                    <CFormInput
                      id="customerName"
                      name="customerName"
                      autocomplete="off"
                      placeholder="Müşteri"
                      disabled
                      value={accountObj.customerName}
                    />
                  </CCol>
                  <CCol md="6">
                    <CFormInput
                      type="date"
                      id="tranDate"
                      name="tranDate"
                      autocomplete="off"
                      placeholder="Tarih"
                      value={
                        accountObj.tranDate
                          ? moment(accountObj.tranDate).format('YYYY-MM-DD')
                          : null
                      }
                      onChange={accountChangeHandler}
                    />
                  </CCol>
                </CInputGroup>
                <CInputGroup row>
                  <CCol md="6">
                    <CFormSelect
                      id="tranType"
                      name="tranType"
                      value={accountObj.tranType}
                      onChange={(e) => {
                        setAccountObj({ ...accountObj, [e.target.name]: e.target.value })
                      }}
                    >
                      <option value="l">Borç</option>
                      <option value="c">Alacak</option>
                    </CFormSelect>
                  </CCol>
                  <CCol md="6">
                    <CFormInput
                      id="description"
                      name="description"
                      autocomplete="off"
                      placeholder="Açıklama"
                      value={accountObj.description}
                      onChange={accountChangeHandler}
                    />
                  </CCol>
                </CInputGroup>
                <CInputGroup row>
                  <CCol md="6">
                    <CFormInput
                      type="number"
                      id="loanAmount"
                      name="loanAmount"
                      disabled={accountObj.tranType === 'l' ? false : true}
                      autocomplete="off"
                      placeholder="Borç"
                      value={accountObj.loanAmount}
                      onChange={accountChangeHandler}
                    />
                  </CCol>
                  <CCol md="6">
                    <CFormInput
                      type="number"
                      id="creditAmount"
                      name="creditAmount"
                      disabled={accountObj.tranType === 'l' ? true : false}
                      autocomplete="off"
                      placeholder="Alındı"
                      value={accountObj.creditAmount}
                      onChange={accountChangeHandler}
                    />
                  </CCol>
                </CInputGroup>
              </CForm>
            </CModalBody>
            <CModalFooter>
              <CButton color="primary" onClick={() => saveAccount()}>
                {' '}
                Kaydet{' '}
              </CButton>
              <CButton color="secondary" onClick={() => setAccountDialog(false)}>
                {' '}
                İptal{' '}
              </CButton>
            </CModalFooter>
          </CModal>
          <CModal size="lg" show={accountListDialog} onClose={setAccountListDialog}>
            <CModalHeader closeButton>
              <CModalTitle>Hesap Listesi</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CTable
                items={accountList}
                fields={accountColumns}
                hover
                striped
                columnFilter={false}
                bordered
                sorter
                responsive
                size="sm"
                itemsPerPage={10}
                pagination
                scopedSlots={{
                  tranDate: (item) => <td>{convertDate(item.tranDate)}</td>,
                }}
              />
            </CModalBody>
          </CModal>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default Customers
