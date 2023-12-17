use actix_web::{
    delete, get, patch, put,
    web::{self, Json},
};
use futures_util::future::join;
use sqlx::MySql;

use crate::{
    header::JwtTokenHeader,
    repository::{auth_user, order::{Order, insert_order}},
    util::types::{AppError, AppResult, AppState, Message},
};

#[derive(serde::Deserialize, serde::Serialize)]
pub struct Cart {
    user_email: String,
    book_id: String,
    price_each: f32,
    quantity_ordered: i64,
}

#[derive(serde::Deserialize, serde::Serialize)]
pub struct CartOrder {
    book_id: String,
    quantity_ordered: i64,
}

#[get("/api/cart")]
pub async fn get_cart(
    jwt_header: JwtTokenHeader,
    app_state: web::Data<AppState>,
) -> AppResult<Json<Vec<Cart>>> {
    let email = &jwt_header.email;
    let pool = &app_state.pool;
    let var_name = sqlx::query_as!(Cart, r#"select * from cart where user_email = ?"#, email);
    let fut_all = join(
        auth_user(&jwt_header, pool),
        var_name.fetch_all(pool),
    )
    .await;

    let auth = fut_all.0?;
    let carts = fut_all.1.map_err(|_| AppError::FailToFetch)?;

    match auth {
        true => Ok(Json(carts)),
        false => Err(AppError::FailToFetch),
    }
}

#[derive(serde::Deserialize, serde::Serialize)]
pub struct CartDeleteType {
    book_id: String,
}

#[delete("/api/cart")]
pub async fn delete_cart(
    data: Json<CartDeleteType>,
    jwt_header: JwtTokenHeader,
    app_state: web::Data<AppState>,
) -> AppResult<Json<Message<()>>> {
    let cart = &data.0;
    let pool = &app_state.pool;

    let auth = auth_user(&jwt_header, pool).await?;

    match auth {
        true => {
            sqlx::query!(
                "delete from cart where user_email = ? and book_id = ?",
                jwt_header.email,
                cart.book_id,
            )
            .execute(pool)
            .await
            .map_err(|_| AppError::FailToUpdate)?;
            Ok(Json(Message {
                message: "delete success",
                payload: None,
            }))
        }
        false => Err(AppError::FailAuthenticate),
    }
}

#[put("/api/cart")]
pub async fn put_cart(
    data: Json<CartOrder>,
    jwt_header: JwtTokenHeader,
    app_state: web::Data<AppState>,
) -> actix_web::Result<Json<Message<()>>> {
    let cart = &data.0;
    let pool = &app_state.pool;

    let auth = auth_user(&jwt_header, pool).await?;
    
    match auth {
        true => {
            sqlx::query!(
                "insert into cart(user_email, book_id, quantity_ordered) values(?, ?, ?)",
                jwt_header.email,
                cart.book_id,
                cart.quantity_ordered
            )
            .execute(pool)
            .await
            .map_err(actix_web::error::ErrorNotFound)?;
            Ok(Json(Message { message: "update success", payload: None }))
        }
        false => Err(actix_web::error::ErrorUnauthorized("fail to authorized"))
    }
}

#[patch("/api/cart")]
pub async fn patch_cart(
    data: Json<CartOrder>,
    jwt_header: JwtTokenHeader,
    app_state: web::Data<AppState>,
) -> Result<Json<Message<()>>, AppError> {
    let cart = &data.0;
    let pool = &app_state.pool;

    let auth = auth_user(&jwt_header, pool).await?;

    match auth {
        true => {
            sqlx::query!(
                "update cart set quantity_ordered = ? where user_email = ? & book_id = ? ",
                cart.quantity_ordered,
                jwt_header.email,
                cart.book_id
            )
            .execute(pool)
            .await
            .map_err(|_| AppError::FailToUpdate)?;
            Ok(Json(Message {
                message: "update success",
                payload: None,
            }))
        }
        false => Err(AppError::FailAuthenticate),
    }
}


#[patch("/api/cart/order")]
pub async fn order_cart(
    jwt_header: JwtTokenHeader,
    app_state: web::Data<AppState>,
) 
-> actix_web::Result<Json<Message<Order>>> {
// -> actix_web::Result<Json<Message<String>>> {
    let user_email = jwt_header.email;
    let pool = &app_state.pool;


    let carts = sqlx::query_as!(Cart,
    r#"select * from cart where user_email = ?"#
    , user_email)
        .fetch_all(pool)
        .await
        .map_err(actix_web::error::ErrorGone)?;
    if carts.len() == 0 {
        return Ok(Json(Message{
            message: "cart is empty",
            payload: None,
        }));
    }

    // let books_id: Vec<String> = carts.iter().map(|cart| cart.book_id.clone()).collect();
    //
    // let books_price = take_price(&books_id, pool)
    //     .await
    //     .map_err(actix_web::error::ErrorNotFound)?;
    
    let new_order = insert_order(pool, &user_email)
        .await
        .map_err(actix_web::error::ErrorInternalServerError)?;
    // sqlx::query!("insert into orders(id, user_email, order_date, require_date) values (?, ?, now(), adddate(now(), 3))", order_id, user_email)
    //     .execute(pool)
    //     .await
    //     .map_err(actix_web::error::ErrorInternalServerError)?;

    let order_id = &new_order.id;

    let mut query_builder: sqlx::QueryBuilder<'_, MySql> =
    sqlx::QueryBuilder::new("insert into orderDetail(order_id, book_id, price_each, quantity_ordered) ");

    // insert card 
    query_builder.push_values(carts, |mut q, cart| {
        q
        .push(order_id)
        .push(cart.book_id)
        .push(cart.price_each)
        .push(cart.quantity_ordered);
    });

    query_builder.build()
        .execute(pool)
        .await
        .map_err(actix_web::error::ErrorBadRequest)?;

    Ok(Json(Message{
        message: "update success",
        payload: Some(new_order)
    }))
}


