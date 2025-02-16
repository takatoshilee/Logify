## DEMO: https://youtu.be/2aH4l0eTJ8M

## Inspiration 💭
According to studies, regular journaling can reduce stress by up to 28% and improve overall well-being. Yet, many people find traditional journaling tedious and uninspiring. That’s why we reinvented it. With Logify, you get the perfect song at the perfect moment—no more endless searching. Our app tracks your emotions with every entry and provides real-time mood ratings and feedback. Logify turns your diary into an engaging, interactive experience that not only boosts mindfulness but also propels personal growth.

## What it does 👀
Logify is a journaling app that connects with leverages OpenAI's API to analyze and quantify your mood score of that journal on a scale of 1 to 100 and provide real time personalized feedback. Based on your entry, the AI not only comments on your feelings but also recommends a song that captures your mood and plays it directly in your journal through the Spotify API. In addition, Logify tracks your mood evaluations daily and visually represents them on a dynamic calendar. Days when you’re feeling down appear in red hues, while happier days glow in vibrant greens. With built-in streak tracking, Logify encourages you to journal every day by gamifying the experience, reinforcing positive habits and promoting self-reflection and personal growth. 


## How we built it 💡
First, we designed our UI in Figma to map out the core pages and to create our HTML and CSS structure. After a working prototype and feedback from the mentors, we built the UI using HTML and CSS. We then implemented backend functionality with JavaScript starting with the entry webpages and implementing the OpenAI API to provide real-time, personalized feedback on your entries and score of the user's mood. We've then used the OpenAI API to parse through the message and suggest keywords, which we then fed into the Spotify API to recommend and play songs directly on the web app based on the user's mood. When the AI returns feedback, we store the numerical mood value along with the entry date in the browser’s cache using Local storage. Later, we retrieve this data to dynamically color-code our calendar (red for lower moods and green for higher moods) and track journaling streaks.

## Challenges we ran into 🌋
Some challenges we encountered included coordinating multiple APIs. OpenAI for mood analysis and Spotify for song recommendations required asynchronous handling and error management. Ensuring that mood scores, dates, and attachments were stored and retrieved consistently from localStorage to drive our dynamic, color-coded calendar and streak tracking was another challenge. Plus, translating our Figma Designs into a responsive UI using HTML, CSS, and JavaScript solve unexpected caching issues with service workers.

## What we learned 🤠
We learned how to integrate OpenAI and Spotify APIs to transform raw journal entries into real-time mood analysis and personalized music, dynamically visualized on a responsive calendar.

## What's next for Logify 🚀
Our next steps include refining the core experience. We want to expand Logify by integrating physical health data, tracking more detailed mood analytics, and even correlating those insights with physiological metrics like heart rate. We’re also exploring the idea of a personalized chatbot that remembers your journal entries and offers tailored suggestions. For now, our focus is on making the current product as useful and user-friendly as possible, with lots of room for growth down the line.

## Contributors
Takatoshi Lee, Gerardus Raynard Effrien, Sani Muhammad Daveisha Ali and Nikita Nathania Rudy.
