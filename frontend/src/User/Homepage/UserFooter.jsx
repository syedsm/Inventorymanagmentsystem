
function UserFooter() {
  return (
    <>
     {/* Footer part */}
     <div className="footer bg-dark text-white py-5 border-top">
     <div className="container-fluid">
       <div className="row">
         {/* Logo Section */}
         <div className="col-md-3">
           <img
             src="/logo.png" // Replace with your logo's path
             alt="Logo"
             className="footer-logo mb-3"
             style={{ width: "150px" }} // Adjust logo size
           />
           <p className="footer-description">
             Lorem ipsum, dolor sit amet consectetur adipisicing elit. Non
             veritatis harum, deserunt voluptates rerum assumenda maxime
             necessitatibus eum praesentium rem dolore corrupti, atque
             repellendus eveniet at impedit, eaque nobis delectus.{" "}
           </p>
         </div>

         {/* Menu Section */}
         <div className="col-md-3">
           <h5>Quick Links</h5>
           <ul className="list-unstyled">
             <li>
               <a href="/home" className="text-white">
                 Home
               </a>
             </li>
             <li>
               <a href="/about" className="text-white">
                 About Us
               </a>
             </li>
             <li>
               <a href="/services" className="text-white">
                 Services
               </a>
             </li>
             <li>
               <a href="/contact" className="text-white">
                 Contact
               </a>
             </li>
           </ul>
         </div>

         {/* Additional Menu Section */}
         <div className="col-md-3">
           <h5>Resources</h5>
           <ul className="list-unstyled">
             <li>
               <a href="/blog" className="text-white">
                 Blog
               </a>
             </li>
             <li>
               <a href="/faq" className="text-white">
                 FAQ
               </a>
             </li>
             <li>
               <a href="/privacy-policy" className="text-white">
                 Privacy Policy
               </a>
             </li>
             <li>
               <a href="/terms-of-service" className="text-white">
                 Terms of Service
               </a>
             </li>
           </ul>
         </div>

         {/* Social Media Section */}
         <div className="col-md-3">
           <h5>Follow Us</h5>
           <ul className="list-unstyled">
             <li>
               <a
                 href="https://facebook.com"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="text-white"
               >
                 <i className="fab fa-facebook-square"></i> Facebook
               </a>
             </li>
             <li>
               <a
                 href="https://twitter.com"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="text-white"
               >
                 <i className="fab fa-twitter"></i> Twitter
               </a>
             </li>
             <li>
               <a
                 href="https://instagram.com"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="text-white"
               >
                 <i className="fab fa-instagram"></i> Instagram
               </a>
             </li>
           </ul>
         </div>
       </div>
     </div>
     {/* Footer Bottom Section */}
     <div className="footer-bottom text-center py-3">
       <p>&copy; Inventory management. 2025 All rights reserved.</p>
     </div>
   </div>
   </>

  )
}

export default UserFooter