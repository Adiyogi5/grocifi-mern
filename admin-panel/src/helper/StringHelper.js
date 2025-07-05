var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

const getDeleteConfig = ({
    title = 'Are you sure?',
    text = "You won't be able to revert this!",
    icon = 'warning',
    confirmButtonText = 'Yes, Delete',
}) => {
    return {
        title, text, icon, confirmButtonText,
        buttonsStyling: false,
        showCancelButton: true,
        // confirmButtonColor: '#3085d6',
        // cancelButtonColor: '#d33',
        customClass: {
            // container: '...',
            popup: 'p-3 m-0 d-flex flex-column gap-3 align-items-center',
            title: 'h3 p-0 m-0',
            icon: 'm-0 mx-auto my-3',
            // image: '...',
            htmlContainer: 'm-0 m-0 fs-0',
            // input: '...',
            // inputLabel: '...',
            // validationMessage: '...',
            actions: 'm-0 p-0',
            denyButton: 'btn btn-secondary',
            confirmButton: 'btn btn-danger me-2',
            closeButton: 'btn btn-secondary',
            cancelButton: 'btn btn-secondary',
            // loader: '...',
            // footer: '...',
            // timerProgressBar: '...',
        }
    }
}

const ucFirst = (string) => {
    return string?.charAt(0)?.toUpperCase() + string?.slice(1);
}

const strLimit = (string, limit) => {
    if (string !== undefined && string.length > limit) {
        return string.substring(0, limit) + "...";
    } else {
        return string
    }
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}


function formatDate(DATE) {
    if (['', null, undefined].includes(DATE)) {
        return null;
    } else {
        var date = new Date(Date.parse(DATE));
        var h = date.getHours()
        var am_pm = "AM"

        if (date.getHours() > 12) {
            h = (date.getHours() - 12);
            am_pm = "PM";
        }

        return (
            [
                padTo2Digits(date.getDate()),
                month[date.getMonth()],
                date.getFullYear(),
            ].join('-')
            +
            ' '
            +
            [
                padTo2Digits(h),
                padTo2Digits(date.getMinutes())
            ].join(':')
            +
            ' '
            + am_pm
        );
    }
}

function formatDateDDMMYYYY(d) {
    var date = new Date(d);

    if (isNaN(date.getTime())) {
        return d;
    } else {

        var day = date.getDate();
        if (day < 10) {
            day = "0" + day;
        }

        return day + " " + month[date.getMonth()] + ", " + date.getFullYear();
    }
}

function formatDateYYMMDD(d) {
    var date = new Date(d);

    if (isNaN(date.getTime())) {
        return d;
    } else {

        var year = date.getFullYear();
        var month = date.getMonth() + 1; // Months are zero-indexed
        var day = date.getDate();

        // Ensure month and day are always two digits
        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }

        return year + "-" + month + "-" + day;
    }
}

function nl2br(str, is_xhtml) {
    if (typeof str === 'undefined' || str === null) {
        return '';
    }
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

const currentDate = (saprator = "/") => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    return `${yyyy}${saprator}${mm}${saprator}${dd}`
}


const currentDateHumanized = (saprator = "/") => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    return `${dd}${saprator}${mm}${saprator}${yyyy}`
}

const debounceFunction = async (fn, delay) => {
    let timerId;
    return (...args) => {
        clearTimeout(timerId);
        timerId = setTimeout(() => fn(...args), delay);
    }
};

const randomInt = (min = 1, max = 10) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const randomColor = (type = 'text') => {
    var digit = randomInt(1, 12)
    var array = ["primary", "secondary", "success", "info", "warning", "danger", "facebook", "google-plus", "twitter", "linkedin", "youtube", "github",]
    return `${type}-${array[digit]}`;
}

function numToString(numberInput) {
    numberInput = parseFloat(numberInput);
    let oneToTwenty = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
    let tenth = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    if (numberInput.toString().length > 7) { //7
        return 'overlimit';
    }

    // let num = ('0000000000' + numberInput).slice(-10).match(/^(\d{1})(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    let num = ('0000000' + numberInput).slice(-7).match(/^(\d{1})(\d{1})(\d{2})(\d{1})(\d{2})$/);

    if (!num) return false;

    let outputText = '';
    outputText += parseFloat(num[1]) !== 0 ? (oneToTwenty[Number(num[1])] || `${tenth[num[1][0]]} ${oneToTwenty[num[1][1]]}`) + ' million ' : '';
    outputText += parseFloat(num[2]) !== 0 ? (oneToTwenty[Number(num[2])] || `${tenth[num[2][0]]} ${oneToTwenty[num[2][1]]}`) + 'hundred ' : '';
    outputText += parseFloat(num[3]) !== 0 ? (oneToTwenty[Number(num[3])] || `${tenth[num[3][0]]} ${oneToTwenty[num[3][1]]}`) + ' thousand ' : '';
    outputText += parseFloat(num[4]) !== 0 ? (oneToTwenty[Number(num[4])] || `${tenth[num[4][0]]} ${oneToTwenty[num[4][1]]}`) + 'hundred ' : '';
    outputText += parseFloat(num[5]) !== 0 ? (oneToTwenty[Number(num[5])] || `${tenth[num[5][0]]} ${oneToTwenty[num[5][1]]} `) : '';
    return outputText;
}

// return true if in range, otherwise false
function inRange(x, min, max) {
    return ((x - min) * (x - max) <= 0);
}


function convertToHr(read_time) {
    const hours = Math.floor(read_time / 60);  // Calculate the number of hours
    const minutes = read_time % 60;  // Calculate the remaining minutes
    return `Time: ${hours} hr ${minutes} min`;
}


export { formatDateYYMMDD,ucFirst, getDeleteConfig, numToString, randomColor, randomInt, strLimit, formatDate, currentDate, nl2br, formatDateDDMMYYYY, currentDateHumanized, debounceFunction, convertToHr }