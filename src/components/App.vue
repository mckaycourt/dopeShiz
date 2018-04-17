<template>
    <div>
        <a href="/api/users/logout"><font size="5">Logout</font></a>
        <div class="contact1">
            <h1>Welcome {{user.name}}</h1>
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
                        <input class="input1" id="time" type="time" name="time" placeholder="Time">
                        <span class="shadow-input1"></span>
                    </div>

                    <div class="wrap-input1 validate-input" data-validate="Valid email is required: ex@abc.xyz">
                        <input class="input1" type="text" name="emailTo" id="emailTo"
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
                        <button class="contact1-form-btn" @click="addToCart()">
						<span>
							Send Email
							<i class="fa fa-long-arrow-right" aria-hidden="true"></i>
						</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
        <div>
            <div v-for="(item, key, index) in items">
                <div>To: {{item.name}}</div>
                <div>Subject: {{item.subject}}</div>
                <div>Sent: {{item.sent}}</div>
                <div @click="removeItem(item, key)">x</div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';

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
                items: []
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
                    })
            },
            logout: function () {
                window.location = '/api/users/logout';
            },
            getItems: function () {
                fetch('/api/items/items', {credentials: 'same-origin'})
                    .then(response => response.json())
                    .then(data => {
                        this.items = data;
                    })
            },
            // getCart: function () {
            //     fetch('/api/cart/items', {credentials: 'same-origin'})
            //         .then(response => response.json())
            //         .then(data => {
            //             this.cart = data;
            //         });
            // },
            addToCart: function () {
                const name = $("#name").val();
                const date = $("#date").val();
                const  time = $("#time").val();
                const emailTo = $("#emailTo").val();
                const subject = $("#subject").val();
                const message = $("#message").val();
                axios.post('/api/items/newItem', {name, date, time, emailTo, subject, message})
                    .then(function (res) {
                        console.log(res);
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
                this.items.push({name, date, time, emailTo, subject, message});
            },
            removeItem: function (item, itemId) {
                console.log(itemId);
                this.items.splice(itemId, 1);
                axios.post('/api/items/removeItem', {_id: item._id})
                    .then(function (res) {
                        console.log(res);
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            }
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