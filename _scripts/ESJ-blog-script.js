// remove :focus from all clickable elements when they are clicked
window.onclick = (event) => {
	if (event.target.classList.contains("button")) {
		event.target.blur();
	}
};

// <<<
// BLOG DATA START

// blog entries
let blogEntries = [
	{
		id: 0,
		headline: "Introduction",
		timestamp: new Date(),
		paragraphs: [
			{
				type: "text",
				content:
					"Lorem ipsum dolor sit amet consectetur adipisicing elit. Et provident modi maiores, quisquam veritatis eum itaque voluptas accusantium vitae nulla?",
			},
			{
				type: "code",
				content: `let greeting = "hello world";

console.log(greeting);`,
			},
			{
				type: "text",
				content:
					"Lorem ipsum dolor sit amet consectetur adipisicing elit. Et provident modi maiores, quisquam veritatis eum itaque voluptas accusantium vitae nulla?",
			},
		],
		tocAddition: "",
	},
	{
		id: 1,
		headline: "Chapter 01",
		timestamp: new Date(),
		paragraphs: [
			{
				type: "text",
				content:
					"Lorem ipsum dolor sit amet consectetur adipisicing elit. Et provident modi maiores, quisquam veritatis eum itaque voluptas accusantium vitae nulla?",
			},
			{
				type: "code",
				content: `let greeting = "hello world";

console.log(greeting);`,
			},
			{
				type: "text",
				content:
					"Lorem ipsum dolor sit amet consectetur adipisicing elit. Et provident modi maiores, quisquam veritatis eum itaque voluptas accusantium vitae nulla?",
			},
		],
		tocAddition: "Values, Types, and Operators",
	},
	{
		id: 2,
		headline: "Chapter 02",
		timestamp: new Date(),
		paragraphs: [
			{
				type: "text",
				content:
					"Lorem ipsum dolor sit amet consectetur adipisicing elit. Et provident modi maiores, quisquam veritatis eum itaque voluptas accusantium vitae nulla?",
			},
			{
				type: "code",
				content: `let greeting = "hello world";

console.log(greeting);`,
			},
			{
				type: "text",
				content:
					"Lorem ipsum dolor sit amet consectetur adipisicing elit. Et provident modi maiores, quisquam veritatis eum itaque voluptas accusantium vitae nulla?",
			},
		],
		tocAddition: "Program Structure",
	},
];

// BLOG DATA END
// >>>

// <<<
// GENERATE BLOG START

var idCounter = 0;

// get element where entry should be placed
const blogColumn = document.querySelector(".blogEntries");

// get element where entries should be inserted before
const blogForm = document.querySelector(".blogForm");

// get blog entry template
const blogEntryTemplate = document.querySelector(".blogEntryTemplate");

// get element for table of contents
const toc = document.querySelector(".tableOfContents");

// get toc template
const tocTemplate = document.querySelector(".tocTemplate");

const getTimeStamp = (date) => {
	return {
		visible: `${date.toLocaleDateString([], {
			year: "numeric",
			month: "long",
			day: "2-digit",
		})} | ${date.toLocaleTimeString([], {
			hour: "numeric",
			minute: "numeric",
		})}`,
		attribute: date.toISOString(),
	};
};

// create entry (from object)
const createBlogEntry = (entry) => {
	// clone blog entry template content,
	// use querySelector for outer wrapping element in template because cloneNode is just the template as fragment
	const newEntry = blogEntryTemplate.content
		.cloneNode(true)
		.querySelector("article");

	// id for blog entry
	newEntry.setAttribute("id", `blog${idCounter}`);

	// h1 content
	newEntry.querySelector("h1").textContent = entry.headline;

	// timestamp
	const timestamp = getTimeStamp(entry.timestamp);

	// time datetime="YYYY-MM–DD HH:MM"
	newEntry
		.querySelector(".blogDate time.blogDateInitial")
		.setAttribute("datetime", timestamp.attribute);
	// visible timestamp
	newEntry.querySelector(".blogDate time.blogDateInitial").textContent =
		timestamp.visible;

	// time of last edit
	if (entry.history) {
		console.log("created entry has history");
		const latestHistory = entry.history[entry.history.length - 1];
		const timestampLastEdit = getTimeStamp(latestHistory.timeOfEdit);

		newEntry.querySelector(
			".blogDate time.blogDateEdit"
		).textContent = `last edit: ${timestampLastEdit.visible}`;
		newEntry
			.querySelector(".blogDate time.blogDateEdit")
			.setAttribute("datetime", timestampLastEdit.attribute);
	}

	// generate text segment from template
	const generateP = (text) => {
		const blogTextTemplate = newEntry.querySelector(".blogTextTemplate");

		// clone from template
		const newParagraph = blogTextTemplate.content
			.cloneNode(true)
			.querySelector("p");
		newParagraph.textContent = text;
		return newParagraph;
	};

	// generate code segment
	const generateCode = (text) => {
		const blogCodeTemplate = newEntry.querySelector(".blogCodeTemplate");

		// clone from template
		const newCode = blogCodeTemplate.content
			.cloneNode(true)
			.querySelector("div.code");
		newCode.querySelector("pre code").textContent = text;
		return newCode;
	};

	// p OR div class="code" > pre
	entry.paragraphs &&
		entry.paragraphs.forEach((p) => {
			const newSegment =
				p.type === "text" ? generateP(p.content) : generateCode(p.content);
			newEntry.appendChild(newSegment);
		});

	// edit button onclick
	newEntry
		.querySelector(".editBlogEntryButton")
		.addEventListener("click", (event) => {
			editBlogEntry(event, entry.id);
		});

	// clone from toc template
	const newTocEntry = tocTemplate.content.cloneNode(true).querySelector("li");

	// add href to id for hacky scrolling
	newTocEntry.querySelector("a").setAttribute("href", `#blog${idCounter}`);

	// add text contents
	newTocEntry.querySelector("span").textContent = entry.headline;
	if (entry.tocAddition) {
		newTocEntry.querySelector("span.small").textContent = entry.tocAddition;
	}

	return {
		createdEntry: newEntry,
		createdTocEntry: newTocEntry,
	};
};

// hardcoded blogentries (later from database)
const generateBlog = (entries) => {
	for (entry of entries) {
		const createdEntry = createBlogEntry(entry);
		// insert entry into parent before form
		blogColumn.appendChild(createdEntry.createdEntry);

		// append new toc entry to toc
		toc.appendChild(createdEntry.createdTocEntry);

		idCounter++;
	}
};

generateBlog(blogEntries);

// GENERATE BLOG END
// >>>

// <<<
// BLOG FORM START

// blog modal
const modal = document.getElementsByClassName("blogForm")[0];
const modalButton = document.getElementsByClassName("toggleBlogFormModal")[0];

const closeModal = () => {
	modal.style.display = "none";
	modalButton.textContent = "+ new entry";
	modalButton.classList.remove("buttonInvert");
};

modalButton.addEventListener("click", (event) => {
	if (event.target.classList.contains("buttonInvert")) {
		closeModal();
	} else {
		modal.style.display = "flex";
		modalButton.textContent = "cancel";
		modalButton.classList.add("buttonInvert");
	}
});

modal.addEventListener("click", (event) => {
	if (event.target == modal) {
		closeModal();
	}
});

//inputs
const formInputs = document.getElementsByClassName("formInputs")[0];

const addSegment = (event, child, parent) => {
	// get parent
	const newInputParent = document.querySelector(`.${parent}`);

	// get template as child
	const inputTemplate = document.querySelector(`template.${child}`);

	// clone from text or code input template
	const newInput = inputTemplate.content
		.cloneNode(true)
		.querySelector(".formInputWrapper");

	// append to input list
	newInputParent.appendChild(newInput);
};

const removeSegment = (event) => {
	event.target.parentNode.remove();
};

const removeSegmentEdit = (event) => {
	removeSegment(event);
	const wasFilled = event.target
		.closest(".formInputWrapper")
		.querySelector(".editInput").value;
	if (wasFilled) {
		validateEdit();
	}
};

const createEntryFromForm = (event) => {
	event.preventDefault();

	// get the relevant input elements
	const userInput = {
		newHeadline: document.getElementsByClassName("formHeadline")[0].value,
		newParagraphs: [...document.getElementsByClassName("newInput")],
		newTocAddition: document.getElementsByClassName("formTocAddition")[0].value,
	};

	// get timestamp
	const now = new Date();

	const newEntry = {
		id: idCounter,
		headline: userInput.newHeadline,
		timestamp: now,
		paragraphs: userInput.newParagraphs.map((p) => {
			return {
				type: p.classList.contains("formParagraph") ? "text" : "code",
				content: p.value,
			};
		}),
		tocAddition: userInput.newTocAddition,
	};

	blogEntries.push(newEntry);

	const createdEntry = createBlogEntry(newEntry);

	// insert entry into parent before form
	blogColumn.appendChild(createdEntry.createdEntry);

	// append new toc entry to toc
	toc.appendChild(createdEntry.createdTocEntry);

	idCounter++;

	// close modal
	closeModal();

	// reset/clear all inputs
	clearInputs();

	// hacky scroll to new entry
	document.getElementById(`blog${idCounter - 1}`).scrollIntoView();
};

const formValidation = (event) => {
	event.target.classList.remove("invalidFormElement");
	setTimeout(() => {
		event.target.classList.add("invalidFormElement");
	}, 1);
};

const clearInputs = () => {
	// reset/clear all inputs
	[...document.getElementsByClassName("userInput")].forEach((input) => {
		input.value = "";
		input.classList.remove("invalidFormElement");
	});
};

// BLOG FORM END
// >>>

// <<<
// COPY CODE START

// copy code snippet to clipboard
const copyCode = (event) => {
	const copyText = event.target.parentNode
		.querySelector("pre")
		.querySelector("code").textContent;
	navigator.clipboard.writeText(copyText);
};

// COPY CODE END
// >>>

// <<<
// EDIT BLOG ENTRY START

// edit form template
const editBlogEntryTemplate = document.querySelector(".editBlogEntryTemplate");

// for storing the unedited blog entry, if edit gets cancelled
let lastEdit;

// make sure only one entry can be edited at a time by keeping track of a "editing state"
let editing = false;

const editBlogEntry = (event, entryId) => {
	// if another entry is currently edited, cancel
	if (editing) {
		cancelEdit();
	}

	// enter editing state
	editing = true;

	// find the data object of the entry
	const toEditData = blogEntries.find((blogEntry) => blogEntry.id == entryId);
	// find the dom node of the entry
	const toEditNode = event.target.closest(".blogEntry");

	// remember the dom node in case of cancellation
	lastEdit = {
		node: toEditNode,
		data: toEditData,
	};

	// clone editing form from template
	const editBlogEntryForm = editBlogEntryTemplate.content
		.cloneNode(true)
		.querySelector(".formEditEntry");

	// fill headline
	editBlogEntryForm.querySelector("h1 input").value = toEditData.headline;

	// fill toc addition if there is any
	if (toEditData.tocAddition) {
		editBlogEntryForm.querySelector(".editTocAddition").value =
			toEditData.tocAddition;
	}

	// fill timestamp
	editBlogEntryForm.querySelector(".blogDate time").textContent = getTimeStamp(
		toEditData.timestamp
	).visible;
	editBlogEntryForm
		.querySelector(".blogDate time")
		.setAttribute("datetime", getTimeStamp(toEditData.timestamp).attribute);

	// paragraph input or code snippet input
	if (toEditData.paragraphs) {
		toEditData.paragraphs.forEach((p) => {
			let newSegment;
			if (p.type === "text") {
				// 1. paragraph template
				const newParagraphTemplate = editBlogEntryForm.querySelector(
					".blogEditTemplateText"
				);
				// 2. clone paragraph
				const newParagraph = newParagraphTemplate.content
					.cloneNode(true)
					.querySelector(".formInputWrapper");
				// 3. fill paragraph
				newParagraph.querySelector("textarea").textContent = p.content;
				newParagraph
					.querySelector(".editTextareaSizer")
					.setAttribute("data-value", p.content);
				newSegment = newParagraph;
			} else {
				// 1. code template
				const newCodeTemplate = editBlogEntryForm.querySelector(
					".blogEditTemplateCode"
				);

				// 2. clone code
				const newCode = newCodeTemplate.content
					.cloneNode(true)
					.querySelector(".formInputWrapper");
				// 3. fill code
				newCode.querySelector("textarea").textContent = p.content;
				newSegment = newCode;
			}

			editBlogEntryForm
				.querySelector(".editFormInputs")
				.appendChild(newSegment);
		});
	}

	// replace entry by editing form
	blogColumn.replaceChild(editBlogEntryForm, toEditNode);
};

let validEdit = false;

const validateEdit = () => {
	if (!validEdit) {
		const editSubmitBtton = document.querySelector(
			".formEditEntry input[type='submit']"
		);
		editSubmitBtton.disabled = false;
		validEdit = true;
	}
};

const updateBlogEntry = (event) => {
	event.preventDefault();

	const editForm = event.target;

	// create timestamp for edit
	const now = new Date();

	// create or extend history property of currently editet entry
	const addHistory = {
		timeOfEdit: now,
		oldHeadline: lastEdit.data.headline,
		oldParagraphs: lastEdit.data.paragraphs,
		oldTocAddition: lastEdit.data.tocAddition,
	};

	if (lastEdit.data.history) {
		lastEdit.data.history.push(addHistory);
	} else {
		lastEdit.data.history = [addHistory];
	}

	// get edited data
	const editedInput = {
		editHeadline: editForm.querySelector(".editHeadline").value,
		editTocAddition: editForm.querySelector(".editTocAddition").value,
		editParagraphs: [...editForm.getElementsByClassName("editInput")],
	};

	// update data
	lastEdit.data.headline = editedInput.editHeadline;
	lastEdit.data.tocAddition = editedInput.editTocAddition;
	lastEdit.data.paragraphs = editedInput.editParagraphs.map((p) => {
		if (p.value) {
			return {
				type: p.classList.contains("editText") ? "text" : "code",
				content: p.value,
			};
		}
	});

	// replace editing form with edited blog entry
	const editedEntry = createBlogEntry(lastEdit.data);
	blogColumn.replaceChild(editedEntry.createdEntry, editForm);

	// replace toc entry with edited toc entry

	// find index of entry
	const tocPosition = blogEntries.findIndex(
		(entry) => entry.id === lastEdit.data.id
	);
	const tocToReplace = toc.querySelectorAll("li")[tocPosition];
	toc.replaceChild(editedEntry.createdTocEntry, tocToReplace);

	clearEditingState();
};

const clearEditingState = () => {
	// exit editing state
	editing = false;

	// reset edit validation for submit button
	validEdit = false;
};
const cancelEdit = () => {
	// get currently active edit form
	const editForm = document.querySelector(".formEditEntry");
	// replace form with entry saved in lastEdit
	blogColumn.replaceChild(lastEdit.node, editForm);

	clearEditingState();
};

// EDIT BLOG ENTRY END
// >>>
