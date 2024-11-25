export function ajaxRequest(url, data) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            method: "POST",
            data: data,
            dataType: "json",
            success: function (response) {
                resolve(response);
            },
            error: function (xhr, status, error) {
                reject(error);
            },
        });
    });
}
