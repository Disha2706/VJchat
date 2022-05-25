exports.isAdmin=function(req,res,next){
    if( res.locals.user.admin ==1){
        next();

    }
    else{
        req.flash("danger","Log in as Tutor");
        res.redirect("/users/login");
    }
}