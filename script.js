// script.js

document.addEventListener('DOMContentLoaded', function() {
    // --- DOM Elements ---
    // Buttons
    const generateBtn = document.getElementById('generateBtn');
    const regenerateBtn = document.getElementById('regenerateBtn');
    const randomizeAllBtn = document.getElementById('randomizeAllBtn');
    const randomizeCoreBtn = document.getElementById('randomizeCoreBtn');
    const randomizeStyleBtn = document.getElementById('randomizeStyleBtn');
    const randomizeAdvancedBtn = document.getElementById('randomizeAdvancedBtn');
    const enhanceBtn = document.getElementById('enhanceBtn');
    const savePresetBtn = document.getElementById('savePresetBtn');
    const copyAllBtn = document.getElementById('copyAllBtn');

    // Inputs & Selects
    const loadPresetSelect = document.getElementById('loadPresetSelect');
    const presetNameInput = document.getElementById('presetName');

    // Containers & Other Elements
    const resultsSection = document.getElementById('results');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const settingsContainer = document.getElementById('settingsContainer');
    const presetSection = document.getElementById('presetSection'); // Needed for dark mode border adjustments
    const darkModeLabel = document.getElementById('darkModeLabel');

    // Input Fields (grouped for easier access in preset handling and generation)
    // This object maps logical names to their corresponding DOM elements.
    const inputFields = {
        subject: document.getElementById('subject'),
        subjectDesc: document.getElementById('subject-desc'),
        environment: document.getElementById('environment'),
        action: document.getElementById('action'),
        style: document.getElementById('style'),
        customStyle: document.getElementById('customStyle'),
        lighting: document.getElementById('lighting'),
        composition: document.getElementById('composition'),
        colors: document.getElementById('colors'),
        mood: document.getElementById('mood'),
        textures: document.getElementById('textures'),
        artists: document.getElementById('artists'),
        resolution: document.getElementById('resolution'),
        render: document.getElementById('render'),
        negativePrompt: document.getElementById('negativePrompt'),
        promptSuffix: document.getElementById('promptSuffix'),
        videoPrompt: document.getElementById('videoPrompt'), // Checkbox
        highDetail: document.getElementById('highDetail'),     // Checkbox
    };

    // --- Component Libraries (for randomization and generation) ---
    // These arrays provide sample data used for randomizing fields and constructing prompts.
    const sampleValues = {
        subjects: ["cyberpunk hacker", "mystical forest spirit", "steampunk airship captain", "post-apocalyptic scavenger", "renaissance alchemist", "futuristic neon samurai", "ancient golem guardian", "celestial cartographer", "dream weaver", "bio-luminescent jellyfish queen"],
        environments: ["neon-lit Tokyo alleyway", "ancient overgrown ruins", "floating sky city", "underground cybernetic lab", "Victorian-era library", "alien desert landscape", "crystal cave system", "submerged Atlantis", "clockwork dimension", "nebula garden"],
        actions: ["casting a powerful spell", "hacking into a mainframe", "steering through a storm", "negotiating with a rogue AI", "discovering an ancient artifact", "battling a shadow creature", "painting a cosmic mural", "leading an expedition", "meditating under twin moons", "building a time machine"],
        textures: ["weathered brass, cracked leather, frosted glass", "polished chrome, glowing circuits, liquid metal", "hand-carved wood, stained parchment, candle wax", "rusted iron, cracked concrete, neon reflections", "silk brocade, tarnished silver, obsidian shards", "bioluminescent fungi, iridescent scales, woven starlight"],
        customStyles: ["vintage sci-fi poster art", "gritty neo-noir comic book style", "ethereal watercolor dreamscape", "bold art deco illustration", "pixel art adventure game scene", "claymation diorama"],
        negativePrompts: ["blurry, low quality, text, watermark", "ugly, disfigured, extra limbs", "poorly drawn hands, mutated faces", "boring, flat, oversaturated"],
        promptSuffixes: ["--ar 16:9", "--ar 9:16", "--style raw", "--chaos 50", "(masterpiece:1.3), (best quality:1.2)", "--v 6.0"]
    };

    // Additional descriptive words and phrases for prompt generation
    const descriptors = ["intricately detailed", "hyper-realistic", "exquisitely rendered", "masterfully composed", "visually striking", "breathtaking", "technically impressive", "professionally lit", "carefully framed", "ultra-high definition", "razor-sharp", "meticulously crafted", "stunningly beautiful", "award-winning", "museum quality"];
    const cameraTerms = ["shot on 85mm lens", "captured with cinematic lighting", "using shallow depth of field", "with dramatic chiaroscuro", "featuring dynamic composition", "with perfect symmetry", "using anamorphic lens flares", "with meticulous attention to detail", "shot on ARRI Alexa", "using Cooke anamorphic lenses", "with beautiful bokeh", "using natural lighting", "with studio-quality lighting", "shot on medium format", "with perfect exposure"];
    const artReferences = ["inspired by Studio Ghibli", "reminiscent of Moebius illustrations", "with a touch of Beksinski", "evoking Zdzisław Beksiński's style", "in the manner of Greg Rutkowski", "inspired by Hayao Miyazaki", "with Artgerm's vibrant colors", "in the style of Alphonse Mucha", "reminiscent of Van Gogh's brushwork", "inspired by Caravaggio's lighting", "with Klimt's decorative elements", "in the style of H.R. Giger", "inspired by Simon Stålenhag", "with Loish's vibrant colors", "in the style of Norman Rockwell"];
    const videoTerms = ["smooth camera movement", "cinematic slow motion", "dynamic tracking shot", "steady glidecam footage", "professional drone cinematography", "fluid motion blur", "seamless transitions between scenes", "with parallax effects", "with beautiful camera choreography", "featuring cinematic camera angles", "with dynamic camera moves", "using Steadicam stabilization", "with dramatic dolly zooms", "featuring sweeping crane shots", "with immersive first-person perspective"];
    const textureKeywords = ["with intricate surface details", "featuring realistic material textures", "with visible brush strokes", "showing detailed fabric textures", "with realistic skin pores", "featuring detailed weathering", "with beautiful water reflections", "showing realistic metal patina", "with intricate carved details", "featuring realistic subsurface scattering", "with detailed wood grain", "showing realistic stone texture", "with beautiful glass refraction", "featuring realistic fur details", "with intricate embroidery patterns"];
    const postProcessing = ["professional color grading", "studio quality post-processing", "meticulous attention to detail", "perfectly balanced composition", "with subtle film grain", "featuring cinematic color grading", "with professional retouching", "using advanced compositing techniques", "with HDR enhancement", "featuring depth of field effects", "with professional sharpening", "using advanced denoising", "with beautiful glow effects", "featuring subtle vignetting", "with professional tone mapping"];

    // --- Dark Mode Logic ---
    /**
     * Applies or removes dark mode classes based on the isDark flag.
     * @param {boolean} isDark - True to enable dark mode, false to disable.
     */
    function applyDarkMode(isDark) {
        const htmlElement = document.documentElement;
        if (isDark) {
            htmlElement.classList.add('dark');
            // Adjust container styles for dark mode (using CSS variables or direct class manipulation)
            // Example assumes CSS handles most changes via `html.dark` selector
            settingsContainer.classList.remove('bg-gray-50', 'border-gray-200'); // Remove light mode specific classes if needed
            settingsContainer.classList.add('bg-dark-800', 'border-dark-700'); // Add dark mode specific classes if needed
            darkModeLabel.textContent = 'Dark Mode';
        } else {
            htmlElement.classList.remove('dark');
            // Adjust container styles for light mode
            settingsContainer.classList.remove('bg-dark-800', 'border-dark-700');
            settingsContainer.classList.add('bg-gray-50', 'border-gray-200');
            darkModeLabel.textContent = 'Light Mode';
        }
        // Update dynamically generated tags (call after applying mode)
        updateDynamicTagStyles();
    }

    /**
     * Updates the classes for dynamically generated tags based on the current mode.
     */
     function updateDynamicTagStyles() {
        const isDark = document.documentElement.classList.contains('dark');
        document.querySelectorAll('#results .flex-wrap span').forEach(tag => {
            // Remove previous mode classes first
            tag.classList.remove('bg-dark-700', 'text-dark-200', 'bg-gray-200', 'text-gray-700', 'tag-dynamic');

            // Add current mode classes
            if (isDark) {
                tag.classList.add('bg-dark-700', 'text-dark-200', 'tag-dynamic');
            } else {
                tag.classList.add('bg-gray-200', 'text-gray-700', 'tag-dynamic');
            }
        });
    }


    // Check localStorage for saved dark mode preference on page load
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'enabled') {
        darkModeToggle.checked = true;
        applyDarkMode(true);
    } else if (savedDarkMode === 'disabled') {
        darkModeToggle.checked = false;
        applyDarkMode(false);
    } else { // Default to dark mode if no preference is saved
         darkModeToggle.checked = true;
         applyDarkMode(true);
         localStorage.setItem('darkMode', 'enabled'); // Save the default
    }

    // Add event listener for the dark mode toggle switch
    darkModeToggle.addEventListener('change', function() {
        if (this.checked) {
            applyDarkMode(true);
            localStorage.setItem('darkMode', 'enabled');
        } else {
            applyDarkMode(false);
            localStorage.setItem('darkMode', 'disabled');
        }
    });

    // --- Event Listeners ---
    generateBtn.addEventListener('click', generatePrompts);
    regenerateBtn.addEventListener('click', generatePrompts); // Regenerate uses the same core logic
    randomizeAllBtn.addEventListener('click', randomizeAllFields);
    randomizeCoreBtn.addEventListener('click', () => randomizeSection('core'));
    randomizeStyleBtn.addEventListener('click', () => randomizeSection('style'));
    randomizeAdvancedBtn.addEventListener('click', () => randomizeSection('advanced'));
    enhanceBtn.addEventListener('click', enhanceDetails);
    savePresetBtn.addEventListener('click', savePreset);
    loadPresetSelect.addEventListener('change', loadPreset);
    copyAllBtn.addEventListener('click', copyAllPrompts);

    // Add event listeners for individual copy buttons within the results section
    resultsSection.addEventListener('click', function(event) {
        const button = event.target.closest('.copy-btn'); // Use event delegation
        if (button) {
            const targetId = button.getAttribute('data-target');
            const textToCopy = document.getElementById(targetId)?.textContent; // Use optional chaining
            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    const icon = button.querySelector('i');
                    icon.classList.remove('fa-copy', 'far');
                    icon.classList.add('fa-check', 'fas');
                    // Revert icon after 2 seconds
                    setTimeout(() => {
                        icon.classList.remove('fa-check', 'fas');
                        icon.classList.add('fa-copy', 'far');
                    }, 2000);
                }).catch(err => {
                    console.error("Failed to copy text: ", err);
                    alert("Failed to copy text."); // Provide user feedback
                });
            }
        }
    });

    // Logic for custom style input: if typed, clear dropdown; if dropdown selected, clear input.
    inputFields.customStyle.addEventListener('input', () => {
        if (inputFields.customStyle.value.trim() !== '') {
            inputFields.style.value = ''; // Clear dropdown selection
        }
    });
    inputFields.style.addEventListener('change', () => {
        if (inputFields.style.value !== '') {
            inputFields.customStyle.value = ''; // Clear custom input
        }
    });

    // --- Core Functions ---

    /**
     * Generates prompts based on current input field values and displays them.
     */
    function generatePrompts() {
        const currentValues = {};
        // Collect values from all input fields
        for (const key in inputFields) {
            const element = inputFields[key];
            currentValues[key] = element.type === 'checkbox' ? element.checked : element.value.trim();
        }

        // Basic validation: Ensure a subject is provided
        if (!currentValues.subject) {
            alert('Please enter a main subject for your prompt.');
            inputFields.subject.focus();
            // Add temporary visual feedback for the required field
            inputFields.subject.classList.add('border-red-500', 'ring-red-500');
            setTimeout(() => inputFields.subject.classList.remove('border-red-500', 'ring-red-500'), 3000);
            return; // Stop generation if subject is missing
        }

        // Show the results section if it's hidden
        resultsSection.classList.remove('hidden');

        const promptStyles = ["cinematic", "artistic", "concept art", "photorealistic"];
        // Generate a prompt for each style variant
        promptStyles.forEach((pStyle, index) => {
            const i = index + 1; // Card index (1-4)
            const promptText = createPrompt(currentValues, pStyle, i);
            const promptElement = document.getElementById(`prompt${i}-text`);
            if (promptElement) {
                promptElement.textContent = promptText;
            }

            // Update tags dynamically for the current prompt card
            const tagsContainer = document.getElementById(`tags${i}`);
            if (tagsContainer) {
                tagsContainer.innerHTML = ''; // Clear existing tags
                const mainStyleTag = currentValues.customStyle || currentValues.style || pStyle;
                if (mainStyleTag) addTag(tagsContainer, mainStyleTag);
                if (currentValues.resolution) addTag(tagsContainer, currentValues.resolution);
                if (currentValues.render) addTag(tagsContainer, currentValues.render.split(' ')[0]); // e.g., "Octane" from "Octane render"
                if (currentValues.mood) addTag(tagsContainer, currentValues.mood.split(' ')[0]); // First word of mood
                if (currentValues.videoPrompt) addTag(tagsContainer, "Video"); // Use videoPrompt checkbox value
            }

            // Trigger fade-in animation for the card
            const card = document.getElementById(`promptCard${i}`);
            if (card) {
                card.classList.remove('fade-in');
                void card.offsetWidth; // Force reflow to restart animation
                card.classList.add('fade-in');
            }
        });

        // Scroll the results section into view smoothly
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        updateDynamicTagStyles(); // Ensure tags have correct colors after generation
    }

    /**
     * Adds a styled tag element to the specified container.
     * @param {HTMLElement} container - The container element to append the tag to.
     * @param {string} text - The text content of the tag.
     */
     function addTag(container, text) {
        const tag = document.createElement('span');
        // Base classes + dynamic mode class added later
        tag.className = `text-xs px-2 py-1 rounded`;
        tag.textContent = text.charAt(0).toUpperCase() + text.slice(1); // Capitalize first letter
        container.appendChild(tag);
        // Note: updateDynamicTagStyles() will apply the correct bg/text color class
    }


    /**
     * Constructs a single prompt string based on input values and a style variant.
     * @param {object} values - An object containing the current values from input fields.
     * @param {string} promptStyleVariant - The style variant (e.g., "cinematic").
     * @param {number} variantNum - The variant number (1-4) for minor variations.
     * @returns {string} The generated prompt string.
     */
    function createPrompt(values, promptStyleVariant, variantNum) {
        let promptParts = []; // Use an array to build the prompt cleanly

        // Core Elements
        if (values.subject) promptParts.push(values.subject);
        if (values.subjectDesc) promptParts.push(values.subjectDesc);
        if (values.environment) promptParts.push(`set in ${values.environment}`);
        if (values.action) promptParts.push(values.action);

        // Determine primary style: Custom > Dropdown > Variant Default
        let chosenStyle = values.customStyle || values.style;

        // Add style-specific elements based on the variant, only if not provided by user
        switch(promptStyleVariant) {
            case "cinematic":
                if (!chosenStyle) promptParts.push("cinematic style");
                promptParts.push("film still from a blockbuster movie");
                if (!values.lighting) promptParts.push("dramatic studio lighting");
                if (!values.composition) promptParts.push("medium close-up shot");
                if (!values.colors) promptParts.push("complementary color scheme");
                if (!values.mood) promptParts.push("epic and grandiose atmosphere");
                break;
            case "artistic":
                if (!chosenStyle) promptParts.push("oil painting style");
                promptParts.push("fine art piece");
                if (!values.lighting) promptParts.push("Rembrandt lighting");
                if (!values.composition) promptParts.push("carefully balanced composition");
                if (!values.colors) promptParts.push("rich color palette");
                if (!values.mood) promptParts.push("emotional and expressive");
                break;
            case "concept art":
                if (!chosenStyle) promptParts.push("concept art style");
                promptParts.push("production design artwork");
                if (!values.lighting) promptParts.push("directional lighting");
                if (!values.composition) promptParts.push("dynamic angle");
                if (!values.colors) promptParts.push("limited color palette");
                if (!values.mood) promptParts.push("futuristic and technological");
                break;
            case "photorealistic":
                if (!chosenStyle) promptParts.push("hyperrealistic style");
                promptParts.push("photograph");
                if (!values.lighting) promptParts.push("natural lighting");
                if (!values.composition) promptParts.push("perfectly framed");
                if (!values.colors) promptParts.push("true-to-life colors");
                if (!values.mood) promptParts.push("authentic and realistic");
                break;
        }

        // Add user-provided or selected values
        if (chosenStyle) promptParts.push(chosenStyle);
        if (values.lighting) promptParts.push(values.lighting);
        if (values.composition) promptParts.push(values.composition);
        if (values.colors) promptParts.push(values.colors);
        if (values.mood) promptParts.push(values.mood);

        // Add random descriptive elements
        promptParts.push(getRandomElement(descriptors));
        promptParts.push(getRandomElement(cameraTerms));

        // Add artist reference (user selection or random)
        if (values.artists) { // Prioritize user selection
             promptParts.push(values.artists);
        } else if (Math.random() > 0.5) { // Add random artist reference sometimes
            promptParts.push(getRandomElement(artReferences));
        }

        // Add textures (user input or random keywords if high detail)
        if (values.textures) {
            promptParts.push(values.textures);
        } else if (values.highDetail) { // Add random texture keyword if "Ultra Detail" is checked
            promptParts.push(getRandomElement(textureKeywords));
        }

        // Add technical details
        if (values.resolution) promptParts.push(values.resolution);
        if (values.render) promptParts.push(values.render);

        // Add video-specific terms if requested
        if (values.videoPrompt) {
            promptParts.push(getRandomElement(videoTerms));
            promptParts.push("4K resolution, 24fps cinematic framerate");
            const videoVariants = ["with subtle film grain", "dynamic depth of field", "choreographed movement", "subtle environmental interactions"];
            promptParts.push(videoVariants[variantNum - 1]); // Use variant number for slight difference
        }

        // Add minor variant-specific elements and post-processing
        const variantElements = ["hyper-detailed textures", "intricate background elements", "thoughtful negative space", "layered visual depth"];
        promptParts.push(variantElements[variantNum - 1]);
        promptParts.push(getRandomElement(postProcessing));

        // Join parts into a string
        let prompt = promptParts.join(', ');

        // Add negative prompt and suffix
        if (values.negativePrompt) {
            prompt += ` --no ${values.negativePrompt}`;
        }
        if (values.promptSuffix) {
            prompt += ` ${values.promptSuffix}`;
        }

        // Clean up extra spaces and trailing commas
        prompt = prompt.replace(/ ,/g, ',').replace(/,$/, '').replace(/  +/g, ' ').trim();
        // Capitalize the first letter
        return prompt.charAt(0).toUpperCase() + prompt.slice(1);
    }

    /**
     * Selects a random element from an array.
     * @param {Array} arr - The array to select from.
     * @returns {*} A random element from the array.
     */
    function getRandomElement(arr) {
        if (!arr || arr.length === 0) return ""; // Handle empty arrays
        return arr[Math.floor(Math.random() * arr.length)];
    }

    /**
     * Randomizes all input fields across sections and then generates prompts.
     */
    function randomizeAllFields() {
        randomizeSection('core', false); // Randomize without triggering generation yet
        randomizeSection('style', false);
        randomizeSection('advanced', false);
        generatePrompts(); // Generate prompts once all sections are randomized
    }

    /**
     * Randomizes the input fields within a specific section.
     * @param {string} section - The section to randomize ('core', 'style', 'advanced').
     * @param {boolean} [triggerGenerate=true] - Whether to generate prompts after randomizing.
     */
    function randomizeSection(section, triggerGenerate = true) {
        // Randomize core elements
        if (section === 'core') {
            inputFields.subject.value = getRandomElement(sampleValues.subjects);
            // Randomly decide whether to add a short description
            inputFields.subjectDesc.value = Math.random() > 0.5 ? getRandomElement(sampleValues.actions).substring(0, 30) + "..." : "";
            inputFields.environment.value = getRandomElement(sampleValues.environments);
            inputFields.action.value = getRandomElement(sampleValues.actions);
        }
        // Randomize style and composition elements
        else if (section === 'style') {
            // Prefer randomizing dropdowns, clear custom style
            inputFields.customStyle.value = '';
            randomizeSelect(inputFields.style);
            randomizeSelect(inputFields.lighting);
            randomizeSelect(inputFields.composition);
            randomizeSelect(inputFields.colors);
        }
        // Randomize advanced settings
        else if (section === 'advanced') {
            randomizeSelect(inputFields.mood);
            inputFields.textures.value = getRandomElement(sampleValues.textures);
            randomizeSelect(inputFields.artists);
            randomizeSelect(inputFields.resolution);
            randomizeSelect(inputFields.render);
            // Randomly add negative prompt or suffix
            inputFields.negativePrompt.value = Math.random() > 0.6 ? getRandomElement(sampleValues.negativePrompts) : "";
            inputFields.promptSuffix.value = Math.random() > 0.6 ? getRandomElement(sampleValues.promptSuffixes) : "";
            // Randomly toggle checkboxes
            inputFields.videoPrompt.checked = Math.random() > 0.7;
            inputFields.highDetail.checked = Math.random() > 0.3;
        }

        // Generate prompts if requested (default behavior)
        if (triggerGenerate) {
            generatePrompts();
        }
    }

    /**
     * Selects a random option (excluding the first placeholder) in a select dropdown.
     * @param {HTMLSelectElement} selectElement - The select element to randomize.
     */
    function randomizeSelect(selectElement) {
         if (selectElement && selectElement.options.length > 1) {
            // Generate a random index between 1 and the last option index
            const randomIndex = Math.floor(Math.random() * (selectElement.options.length - 1)) + 1;
            selectElement.selectedIndex = randomIndex;
        } else if (selectElement && selectElement.options.length === 1 && selectElement.options[0].value === "") {
            // If only the placeholder exists, do nothing or set index to 0
            selectElement.selectedIndex = 0;
        }
    }

    /**
     * Enhances the detail of existing generated prompts by adding more keywords.
     */
    function enhanceDetails() {
        if (resultsSection.classList.contains('hidden')) {
            alert("Please generate some prompts first before enhancing.");
            return;
        }

        for (let i = 1; i <= 4; i++) {
            const promptTextElem = document.getElementById(`prompt${i}-text`);
            if (!promptTextElem) continue; // Skip if element doesn't exist

            let currentPrompt = promptTextElem.textContent;
            // Temporarily remove existing suffix and negative prompt for cleaner enhancement
            const suffixMatch = currentPrompt.match(/ (--ar .*|--style .*|--chaos .*|\([\w\s.:]+\d\))/g) || [];
            const negativeMatch = currentPrompt.match(/ --no .*/);
            const originalSuffix = suffixMatch.join(' ');
            const originalNegative = negativeMatch ? negativeMatch[0] : '';

            currentPrompt = currentPrompt.replace(originalNegative, '').replace(originalSuffix, '').trim().replace(/,$/, ''); // Remove suffix/negative and trailing comma


            const newTexture = getRandomElement(textureKeywords);
            const newPostProcessing = getRandomElement(postProcessing);

            let enhancedParts = [currentPrompt];

            // Add new details if they aren't already obviously present
            if (!currentPrompt.toLowerCase().includes(newTexture.split(' ')[0].toLowerCase())) {
                enhancedParts.push(newTexture);
            }
            if (!currentPrompt.toLowerCase().includes(newPostProcessing.split(' ')[0].toLowerCase())) {
                 enhancedParts.push(newPostProcessing);
            }

            // Reconstruct the prompt
            let enhancedPrompt = enhancedParts.join(', ');

            // Re-add original negative prompt and suffix (or current input values if preferred)
            // Using original values from the prompt itself:
            enhancedPrompt += originalNegative;
            enhancedPrompt += originalSuffix;
            // Alternatively, use current input field values:
            // if (inputFields.negativePrompt.value) enhancedPrompt += ` --no ${inputFields.negativePrompt.value}`;
            // if (inputFields.promptSuffix.value) enhancedPrompt += ` ${inputFields.promptSuffix.value}`;


            promptTextElem.textContent = enhancedPrompt.replace(/ ,/g, ',').replace(/,$/, '').replace(/  +/g, ' ').trim();

            // Add visual feedback (pulse effect) to the enhanced card
            const card = document.getElementById(`promptCard${i}`);
            if (card) {
                card.classList.add('ring-2', 'ring-purple-500', 'animate-pulse-fast');
                setTimeout(() => {
                    card.classList.remove('ring-2', 'ring-purple-500', 'animate-pulse-fast');
                }, 1500); // Remove effect after 1.5 seconds
            }
        }
         updateDynamicTagStyles(); // Update tags in case any were added implicitly
    }

    // --- Preset Management ---

    /**
     * Saves the current input field values as a preset in localStorage.
     */
    function savePreset() {
        const name = presetNameInput.value.trim();
        if (!name) {
            alert('Please enter a name for the preset.');
            presetNameInput.focus();
            return;
        }

        const presetData = {};
        // Store the value/checked state of each input field
        for (const key in inputFields) {
            const element = inputFields[key];
            presetData[key] = element.type === 'checkbox' ? element.checked : element.value;
        }

        try {
            localStorage.setItem(`promptCraftPreset_${name}`, JSON.stringify(presetData));
            alert(`Preset "${name}" saved!`);
            presetNameInput.value = ''; // Clear input field after saving
            populatePresetList(); // Refresh the dropdown list
        } catch (e) {
            console.error("Error saving preset to localStorage:", e);
            alert("Could not save preset. Local storage might be full or disabled.");
        }
    }

    /**
     * Loads the selected preset data from localStorage into the input fields.
     */
    function loadPreset() {
        const name = loadPresetSelect.value;
        if (!name) return; // Do nothing if the placeholder is selected

        const presetDataString = localStorage.getItem(`promptCraftPreset_${name}`);
        if (presetDataString) {
            try {
                const presetData = JSON.parse(presetDataString);
                // Apply saved values to the input fields
                for (const key in presetData) {
                    if (inputFields[key]) { // Check if the input field still exists
                        const element = inputFields[key];
                        if (element.type === 'checkbox') {
                            element.checked = presetData[key];
                        } else {
                            element.value = presetData[key];
                        }
                    }
                }
                alert(`Preset "${name}" loaded!`);
                generatePrompts(); // Optionally generate prompts immediately after loading
            } catch (e) {
                console.error("Error parsing preset data:", e);
                alert(`Could not load preset "${name}". The data might be corrupted.`);
            }
        } else {
            alert(`Preset "${name}" not found.`); // Should not happen if list is populated correctly
        }
    }

    /**
     * Populates the preset dropdown list with presets found in localStorage.
     */
    function populatePresetList() {
        loadPresetSelect.innerHTML = '<option value="">-- Select a Preset --</option>'; // Clear existing options
        let presetFound = false;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('promptCraftPreset_')) {
                const presetName = key.replace('promptCraftPreset_', '');
                const option = document.createElement('option');
                option.value = presetName;
                option.textContent = presetName;
                loadPresetSelect.appendChild(option);
                presetFound = true;
            }
        }
        // Optionally disable the select if no presets are found
        // loadPresetSelect.disabled = !presetFound;
    }

    /**
     * Copies all generated prompts (V1-V4) to the clipboard.
     */
    function copyAllPrompts() {
        if (resultsSection.classList.contains('hidden')) {
            alert("Please generate some prompts first before copying.");
            return;
        }
        let allPromptsText = "";
        for (let i = 1; i <= 4; i++) {
            const promptText = document.getElementById(`prompt${i}-text`)?.textContent;
            if (promptText) {
                allPromptsText += `Prompt Version ${i}:\n${promptText}\n\n`;
            }
        }

        if (allPromptsText) {
            navigator.clipboard.writeText(allPromptsText.trim()).then(() => {
                const icon = copyAllBtn.querySelector('i');
                icon.classList.remove('fa-copy', 'far');
                icon.classList.add('fa-check', 'fas');
                setTimeout(() => {
                    icon.classList.remove('fa-check', 'fas');
                    icon.classList.add('fa-copy', 'far');
                }, 2000);
            }).catch(err => {
                console.error("Failed to copy all prompts: ", err);
                alert("Failed to copy all prompts.");
            });
        } else {
             alert("No prompts available to copy.");
        }
    }

    // --- Initialization ---
    populatePresetList(); // Load presets into the dropdown on page load
    // Initial dark mode application is handled earlier based on localStorage/default

}); // End DOMContentLoaded
