<template>
    <div>
        <a href="/api/users/logout"><font size="5">Logout</font></a>
        <div class="contact1">
            <div class="container-contact1">
                <div class="contact1-pic js-tilt" data-tilt>
                <img :src="imageLink" alt="IMG">
                </div>


                <form class="contact1-form validate-form">
				<span class="contact1-form-title test">
					Automated Message
				</span>

                    <div class="wrap-input1 validate-input" data-validate="Name is required">
                        <input class="input1" id="name" type="text" name="name" placeholder="Name">
                        <span class="shadow-input1"></span>
                    </div>

                    <div class="wrap-input1 validate-input" data-validate="Select date">
                        <input class="input1" id="date" type="date" name="date" placeholder="Date">
                        <span class="shadow-input1"></span>
                    </div>

                    <div class="wrap-input1 validate-input" data-validate="Select a time">
                        <input class="input1" id="time" type="time" name="Time" placeholder="Time">
                        <span class="shadow-input1"></span>
                    </div>

                    <div class="wrap-input1 validate-input" data-validate="Valid email is required: ex@abc.xyz">
                        <input class="input1" type="text" name="emailTo" id="emailReceiver"
                               placeholder="Email of Recipient">
                        <span class="shadow-input1"></span>
                    </div>

                    <div class="wrap-input1 validate-input" data-validate="Subject is required">
                        <input class="input1" type="text" name="subject" id="subject" placeholder="Subject">
                        <span class="shadow-input1"></span>
                    </div>

                    <div class="wrap-input1 validate-input" data-validate="Message is required">
                        <textarea class="input1" name="message" id="message" placeholder="Message"></textarea>
                        <span class="shadow-input1"></span>
                    </div>

                    <div class="container-contact1-form-btn">
                        <button class="contact1-form-btn">
						<span>
							Send Email
							<i class="fa fa-long-arrow-right" aria-hidden="true"></i>
						</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    // import axios from 'axios';

    export default {
        data: function () {
            this.getInitData();
            this.getItems();
            // this.getCart();
            return {
                loaded: false,
                // friends: [],
                user: null,
                imageLink: "/images/img-01.png",
                items: [],
                // cart: []
            }
        },
        methods: {
            getInitData: function () {
                fetch('/api/init', {credentials: 'same-origin'})
                    .then(response => response.json())
                    .then(data => {
                        // this.friends = data.friends;
                        this.user = data.user;
                        this.loaded = true;
                    });
            },
            logout: function () {
                window.location = '/api/users/logout';
            },
            getItems: function () {
                fetch('/api/items/items', {credentials: 'same-origin'})
                    .then(response => response.json())
                    .then(data => {
                        this.items = data;
                    });
            },
            // getCart: function () {
            //     fetch('/api/cart/items', {credentials: 'same-origin'})
            //         .then(response => response.json())
            //         .then(data => {
            //             this.cart = data;
            //         });
            // },
            // addToCart: function (item) {
            //     axios.post('/api/cart/newItem', {itemName: item.itemName, itemInfo: item.itemInfo, quantity: item.quantity})
            //         .then(function (res) {
            //             console.log(res);
            //         })
            //         .catch(function (err) {
            //             console.log(err);
            //         });
            //     this.cart.push({itemName: item.itemName, itemInfo: item.itemInfo});
            // },
            // removeFromCart: function (item, itemId) {
            //     console.log(itemId);
            //     this.cart.splice(itemId, 1);
            //     axios.post('/api/cart/removeItem', {itemName: item.itemName, itemInfo: item.itemInfo})
            //         .then(function (res) {
            //             console.log(res);
            //         })
            //         .catch(function (err) {
            //             console.log(err);
            //         });
            // }
        }
    }
</script>

<style scoped>
    #app {
        opacity: 0;
        transition: opacity 300ms ease-out;
    }

    #app.loaded {
        opacity: 1;
    }
</style>