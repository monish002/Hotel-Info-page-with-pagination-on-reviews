=============================================================================

Following are few notes regarding the assignment:
1. Priorities as per task 1 are in following section.
2. Attachment contains architecture diagram of my changes. To make it fast, I just drawn it on paper and took a snapshot.
3. I used knockoutJS library for the assignment. If you want, I can spend some time over the weekend and submit the solution again without the use of knockoutJS.

Thanks for the opportunity to take the assignment. I will wait for the feedback.
Monish Gupta
=============================================================================


This assignment is designed to test your client-side coding skills and show us
what you’re good at! You can add or modify any of the JavaScript, HTML and CSS
to complete the assignment. JQuery has been included for your convenience, but
is not required. Please do not use jQuery plugins. Also avoid frameworks like
Angular and Backbone. Please make sure the page works as a static page without
the need to run a web server or a build script.

First, prioritize the list of tasks below from high to low (1 -> top priority,
6-> lowest priority). Please explain why you choose to prioritize this way,
and what you considered when assigning high or low priority to each task.

Second, pick at least two tasks out of the list and implement them. You may choose
whatever tasks you prefer that you think will best reflect your coding skills.
Browser support should include IE8+, Chrome, Safari, FF.

Tasks
========================================

 *  Imagine there is a JSON feed with hotels similar to the current one.
 	Design JSON format and use the feed to display similar hotels on the page.
	
	P1 as this is very fundamental for the functioning of the website.
	
 *  Split the reviews into blocks of 5 and create pagination. Allow the user
	to sort the reviews by review score.
	
	P4. With huge list of reviews, user would need to scroll the page a lot. Paging can help here.

 *  Improve the room table. Allow the user to sort the room table by occupancy
 	or price, display a total when the user selects a quantity, display
 	additional information about rooms.
	
	P5. Assuming that hotels would not have more than 10-15 types of rooms, sorting will not add much value.

 *  Create a photo carousel using the large photos linked from the thumbnails
	currently in the page. Include an automatic	slideshow mode, add prev/next
	buttons to manually controll the carousel, add a layer that shows the
	contents of the images alt text.
	
	P2 as the current user experience to view the larger size of photos is not good.

 *  Improve the facilities block.
 
	P6. Already shows the basic information. Much more is needed in other components.

 *  Add an interactive location block to the page. It should contain a map and
 	some nearby landmarks.
	
	P3 as this feature can help users decide on their transactions quickly. This should be tried in A/B testing to find out the usage and increase in conversions.