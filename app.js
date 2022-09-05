/**
 ** [Contact List App]
*? Select Html DOM Element
*/

//* Access To All Inputs
const firstName = document.getElementById("first_name");
const lastName = document.getElementById("last_name");
const userCountry = document.getElementById("user_country");
const userNumber = document.getElementById("user_number");
const theGender = document.getElementsByName("gender");
//* contactsOverlay
const contactsOverlay = document.getElementsByClassName("available-contacts")[0];
// Html DOM ul Element
const contactsList = document.getElementsByClassName("contacts-list")[0];
// Suucess Message Element
const successMsg = document.getElementsByClassName("success-msg")[0];

//* Access To All Btns
const addBtn = document.getElementById("add");
const cancelBtn = document.getElementById("cancel");
const openBtn = document.getElementById("open");
const closeBtn = document.getElementById("close");
const resetBtn = document.getElementById("reset");

//! App Variables
let itemId = 0;

class ContactItem {
    constructor(id, fName, lName, country, number, gender) {
        this.id = id;
        this.fN = fName;
        this.lN = lName;
        this.cN = country;
        this.num = number;
        this.gender = gender;
    };

    //* Get Full User Name Method
    // getFullName() {
    //     let fullName = this.fN.concat(" " + this.lN);
    //     return fullName;
    // };
};

//* cancelBtn addEventListener(Click)
cancelBtn.addEventListener("click", _ => document.getElementById("contact_form").reset());

contactsLsitSidebar();

//* contactsLsitSidebar Function [1]
function contactsLsitSidebar() {
    // Open Contacts List Sidbar
    openBtn.addEventListener("click", _ => {
            contactsOverlay.classList.add("open");
    });

    // Close Contacts List Sidbar
    closeBtn.addEventListener("click", _ => {
        contactsOverlay.classList.remove("open");
    });
};

//* saveContactItems Function
function saveContactItems(itmes) {
    return localStorage.setItem("contactItems", JSON.stringify(itmes));
};

//* getContactItems Function
function getContactItems() {
    return localStorage.getItem("contactItems") ? JSON.parse(localStorage.getItem("contactItems")) : [];
};


//* addContactItem Function
function addContactItem(fN, lN, cN, num) {
    let gender = "unknown";

    //TODO Add Btn (Actoins)
    addBtn.addEventListener("click", _ => {

        // Check Gender Inputs
        theGender.forEach(input => {
            if (input.checked) {
                gender = input.value;
            };
        });

        if (validInputs(fN, lN, cN, num)) {

            // Get Array Of Items From localStorage
            let itmes = getContactItems();

            //* Add Data To ContactItem
            const contactItem = new ContactItem (
                itemId,
                fN.value.trim().toLowerCase(),
                lN.value.trim().toLowerCase(),
                cN.value.trim().toLowerCase(),
                num.value,
                gender
            );

            // Increase Id By One
            itemId++;

            //? Push ContactItem To Items Array
            itmes.push(contactItem);

            //saveContactItems In LocalStoarge
            saveContactItems(itmes);

            //! Reset All Inputs
            fN.value = "";
            lN.value = "";
            cN.value = "";
            num.value = "";

            theGender.forEach(input => {
                if (input.checked) {
                    input.checked = false;
                    gender = "unknown";
                };
            });

            //* Invoke createContactItem Function
            createContactItem(contactItem);

            setTimeout(_=> {
                //* Add Open Class To contactsOverlay After Timeout
                contactsOverlay.classList.add("open");
            }, 500);

            setTimeout(_=> {
            //* Remove Show-Msg Class From successMsg DOM Element After Timeout
                successMsg.classList.remove("show-msg");
            }, 1500);

            //* Add Show-Msg Class To successMsg DOM Element
            successMsg.classList.add("show-msg");
        };
    });
};

//* Create Contact Item Function [2]
function createContactItem(item) {
    //* Destruction Data From item Obj
    const {id, fN, lN, cN, num, gender: gN} = item;
    // const fullName = item.getFullName();
    const fullName = fN.concat(" " + lN);

    //? Create Contact List Element(li)
    const li = document.createElement("li");
    li.className = "contact-box";

    let result = `
        <div class="contact-id"> contact id: <span>${id}</span></div>
        <div class="contact-name">name: <span>${fullName}</span></div>
        <div class="contact-country">country: <span>${cN}</span></div>
        <div class="contact-number">number: <span>${num}</span></div>
        <div class="theGender">gender: <span>${gN}</span></div>

        <button class="delete" data-id="${id}">
            <i class="fas fa-trash-alt"></i>
            <span>delete<span/>
        </button>
    `;

    li.innerHTML = result;

    // Append li Element To Contacts List Container
    contactsList.appendChild(li);
};

//* validInputs Function
function validInputs(fN, lN, cN, num) {
    if (fN.value !== "" && lN.value !== "" && cN.value !== "" && num.value !== "") {
        return true;

    } else {
        let inputs = [];
        inputs.push(fN, lN, cN, num);

        //? Looping On inputs Array
        inputs.forEach(input => {
            // input Parent
            let inputParent = input.parentElement;

            setTimeout(_ => {
                // Remove Error Class From inputParent
                inputParent.classList.remove("error");
            }, 1500)

            // Add Error Class To inputParent
            inputParent.classList.add("error");

            //! Set Error Message
            inputParent.lastElementChild.innerText = "this field is required";
        });
    };
};


//* Setup APP Function [3]
function setupApp() {
    // Get Contact Items Array From localStorage
    const concatItems = getContactItems();

    populateContactItmes(concatItems);
};

//* Setup APP Function [4]
function populateContactItmes(concatItems) {
    if (concatItems.length > 0) {
        //* Set itemId Value
        itemId = concatItems[concatItems.length - 1].id;
        // Increase Id By One
        itemId++;

    } else {
        itemId = 1;
    };

    //? Looping On concatItems
    concatItems.forEach(item => createContactItem(item));
};

//* Remove removeLogic Function [5]
function removeLogic() {

    contactsList.addEventListener("click", e => {

        //* Check Event target contains Delete Class
        if (e.target.classList.contains("delete")) {
            // Get Custom Data Id Att
            const btnID = e.target.dataset.id;

            //? Invoke removeContactItem
            removeContactItem(btnID);

            //* Remove ContactItem From Html DOM
            contactsList.removeChild(e.target.parentElement);

            //* Check contactsList Child Conut
            if (contactsList.childElementCount < 1) {

                setTimeout(_=> {
                    // Remove open Class From contactsOverlay
                    contactsOverlay.classList.remove("open");
                }, 500);
            }
        };
    });
};

//* removeContactItem Function [5]
function removeContactItem(id) {
    // Get concatItems Array From localStorage
    let concatItems = getContactItems();

    //* Filter concatItems Array
    concatItems = concatItems.filter(item => item.id != id);

    //? Store concatItems Array In localStorage After Updated
    saveContactItems(concatItems);

    //!Important: Reset itemId Value
    if (concatItems.length > 0) {
        //* Set itemId Value
        itemId = concatItems[concatItems.length - 1].id;
        // Increase Id By One
        itemId++;

    } else {
        itemId = 1;
    };
};

//* clearConactsList Function [6]
function clearConactsList() {
    resetBtn.addEventListener("click", _ => {
        removeAllItems();
    });
};

//* removeAllItems Function [7]
function removeAllItems() {
    // Get Contact Items Array From localStorage
    let concatItems = getContactItems();

    //* Get A New Array Of Itmes ID
    let itemsID = concatItems.map(item => item.id);

    //? Looping On itemsID Array
    itemsID.forEach(id => removeContactItem(id));

    //* Remove All Contact List
    while (contactsList.children.length > 0) {
        contactsList.removeChild(contactsList.children[0]);
    };

    setTimeout(_=> {
        // Remove open Class From contactsOverlay
        contactsOverlay.classList.remove("open");
    }, 500);
};

//! App Function Run After DOMContentLoaded
document.addEventListener("DOMContentLoaded", function() {
    setupApp();
    addContactItem(firstName, lastName, userCountry, userNumber);
    removeLogic();
    clearConactsList();
});