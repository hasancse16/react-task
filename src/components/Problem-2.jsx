import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const Problem2 = () => {

  const [modalAOpen, setModalAOpen] = useState(false);
  const [modalBOpen, setModalBOpen] = useState(false);
  const [modalCOpen, setModalCOpen] = useState(false);
  const [contactsB, setContactsB] = useState([]);
  const [searchTermB, setSearchTermB] = useState('');
  const [onlyEven, setOnlyEven] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [contactsA, setContactsA] = useState([]);
  const [searchTermA, setSearchTermA] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimeoutRef = useRef(null);

  useEffect(() => {
    fetchContacts();
  }, [modalAOpen, modalBOpen]);
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTermA !== "") {
        fetchContacts();
        setPage(1);
      }else{
        fetchContacts();
        setPage(1);
      }
    }, 3000); 
    return () => clearTimeout(delayDebounceFn);
  }, [searchTermA,searchTermB, page]);

  const handleSearchInputChange = (event) => {
    const { value } = event.target;
    setSearchTermA(value);
    setSearchTermB(value);
  };

  const handleSearchInputKeyPress = (event) => {
    if (event.key === 'Enter') {
      fetchContacts();
    }
  };

  const handleScroll = (event) => {
    const { scrollTop, clientHeight, scrollHeight } = event.target;
    if (scrollHeight - scrollTop === clientHeight) {
      console.log('true')
      setPage((prevPage) => prevPage + 1);
    }
  };

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      let response;
      if(modalAOpen){
        response = await axios.get(
          `https://contact.mediusware.com/api/contacts/?page=${page}&search=${searchTermA}`
        );
        let filteredContacts = response?.data?.results;
        if (onlyEven) {
          filteredContacts = filteredContacts.filter((contact) => contact.id % 2 === 0);
        }
        if (page === 1) {
          setContactsA(filteredContacts);
        } else {
          setContactsA((prevContacts) => [...prevContacts, ...filteredContacts]);
        }
      }
      if(modalBOpen){
        response = await axios.get(
          `https://contact.mediusware.com/api/country-contacts/United States/?page=${page}&search=${searchTermB}`
        );
        let filteredContacts = response?.data?.results;
        if (onlyEven) {
          filteredContacts = filteredContacts.filter((contact) => contact.id % 2 === 0);
        }
        if (page === 1) {
          setContactsB(filteredContacts)
        } else {
          setContactsB((prevContacts) => [...prevContacts, ...filteredContacts])
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  const openModalA = () => {
    setModalAOpen(true);
    setModalBOpen(false);
    setModalCOpen(false);
  };

  const openModalB = () => {
    setModalAOpen(false);
    setModalBOpen(true);
    setModalCOpen(false);
  };

  const openModalC = (contact) => {
    setSelectedContact(contact);
    setModalCOpen(true);
  };

  const closeModal = () => {
    setModalAOpen(false);
    setModalBOpen(false);
    setModalCOpen(false);
  };

  const handleCheckboxChange = (e) => {
    setOnlyEven(e.target.checked);
  };

  useEffect(() => {
    fetchContacts();
  }, [onlyEven])
  
    return (

        <div className="container">
           <div className="row justify-content-center mt-5">
      <h4 className="text-center text-uppercase mb-5">Problem-2</h4>

      <div className="d-flex justify-content-center gap-3">
        <button className="btn btn-lg btn-outline-primary" style={{backgroundColor: '#46139f', color: '#fff'}} type="button" onClick={openModalA}>
          All Contacts
        </button>
        <button className="btn btn-lg btn-outline-warning" style={{backgroundColor: '#ff7f50', color: '#fff'}} type="button" onClick={openModalB}>
          US Contacts
        </button>
      </div>

      {/* Modal A */}
          <div onScroll={handleScroll} className={`modal ${modalAOpen ? 'show' : ''}`} style={{ display: modalAOpen ? 'block' : 'none' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Modal A</h5>
              <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {/* Contact list and search input */}
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Search contacts"
                value={searchTermA}
                onChange={handleSearchInputChange}
                onKeyDown={handleSearchInputKeyPress}
              />
              <div className="contact-list">
                {contactsA && contactsA
                  .map((contact) => (
                    <div
                      key={contact.id}
                      className="contact-item"
                      style={{cursor: 'pointer'}}
                      onClick={() => openModalC(contact)}
                    >
                      {contact.phone}
                    </div>
                  ))}
                  {isLoading && <div>Loading more contacts...</div>}
              </div>
            </div>
            <div className="modal-footer">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="onlyEvenCheckbox"
                  checked={onlyEven}
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor="onlyEvenCheckbox">
                  Only Even
                </label>
              </div>
              <button type="button" style={{backgroundColor: '#46139f', color: '#fff'}} className="btn btn-secondary" onClick={openModalA}>
                All Contacts
              </button>
              <button type="button" style={{backgroundColor: '#ff7f50', color: '#fff'}} className="btn btn-secondary" onClick={openModalB}>
                US Contacts
              </button>
              <button type="button" style={{backgroundColor: '#fff', border: '1px solid #46139f', color: '#46139f'}} className="btn btn-secondary" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal B */}
      <div className={`modal ${modalBOpen ? 'show' : ''}`} style={{ display: modalBOpen ? 'block' : 'none' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Modal B</h5>
              <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {/* Contact list and search input */}
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Search contacts"
                value={searchTermB}
                onChange={handleSearchInputChange}
                onKeyDown={handleSearchInputKeyPress}
              />
              
              <div className="contact-list">
                    {contactsB && contactsB.map((contact) => (
                    <div
                      key={contact.id}
                      className="contact-item"
                      style={{cursor: 'pointer'}}
                      onClick={() => openModalC(contact)}
                    >
                      {contact.phone}
                    </div>
                  ))}
              </div>
            </div>
            <div className="modal-footer">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="onlyEvenCheckbox"
                  checked={onlyEven}
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor="onlyEvenCheckbox">
                  Only Even
                </label>
              </div>
              <button type="button" style={{backgroundColor: '#46139f', color: '#fff'}} className="btn btn-secondary" onClick={openModalA}>
                All Contacts
              </button>
              <button type="button" style={{backgroundColor: '#ff7f50', color: '#fff'}} className="btn btn-secondary" onClick={openModalB}>
                US Contacts
              </button>
              <button type="button" style={{backgroundColor: '#fff', border: '1px solid #46139f', color: '#46139f'}} className="btn btn-secondary" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal C */}
      <div className={`modal ${modalCOpen ? 'show' : ''}`} style={{ display: modalCOpen ? 'block' : 'none' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Contact Details</h5>
              <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <h6>Contact Details</h6>
              {selectedContact && (
                <div>
                  <p className='mb-1'>Country Name: {selectedContact?.country?.name}</p>
                  <p>Phone: {selectedContact?.phone}</p>
                  {/* Add more contact details here */}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button style={{backgroundColor: '#fff', border: '1px solid #46139f', color: '#46139f'}} type="button" className="btn btn-secondary" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
        </div>
    );
};

export default Problem2;